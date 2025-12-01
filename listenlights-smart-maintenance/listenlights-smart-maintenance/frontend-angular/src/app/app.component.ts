import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'technician';
}

interface Device {
  _id: string;
  name: string;
  location: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'completed';
  device: Device;
  assignedTo?: { name: string; email: string };
  createdBy?: { name: string; email: string };
  dueDate?: string;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <div class="card" *ngIf="!user">
        <h1>Listenlights Smart Maintenance</h1>
        <p>Login as Admin or Technician to manage building tasks.</p>

        <form (ngSubmit)="login()">
          <input
            type="email"
            [(ngModel)]="loginEmail"
            name="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            [(ngModel)]="loginPassword"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>

        <p style="margin-top: 8px; font-size: 13px;">
          Demo accounts (after running seed APIs):
          <br />
          <strong>Admin:</strong> admin@listenlights.com / admin123
          <br />
          <strong>Technician:</strong> tech@listenlights.com / tech123
        </p>

        <p *ngIf="error" style="color:#fca5a5;">{{ error }}</p>
      </div>

      <div class="card" *ngIf="user">
        <div style="display:flex; justify-content: space-between; align-items:center;">
          <div>
            <h1>Smart Maintenance Console</h1>
            <p style="margin:0; font-size: 14px;">
              Logged in as <strong>{{ user.name }}</strong> ({{ user.role }})
            </p>
          </div>
          <button class="secondary" (click)="logout()">Logout</button>
        </div>
      </div>

      <div class="card" *ngIf="user">
        <h2>Devices</h2>
        <button (click)="loadDevices()">Reload Devices</button>
        <button *ngIf="user.role === 'admin'" (click)="seedDevices()" class="secondary">
          Seed Sample Devices
        </button>

        <table class="table" *ngIf="devices.length">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of devices">
              <td>{{ d.name }}</td>
              <td>{{ d.location }}</td>
              <td>{{ d.type }}</td>
              <td>
                <span class="badge" [ngClass]="'badge ' + d.status">
                  {{ d.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!devices.length">No devices yet.</p>

        <div *ngIf="user.role === 'admin'" style="margin-top:12px;">
          <h3>Add Device</h3>
          <input [(ngModel)]="newDevice.name" name="dname" placeholder="Name" />
          <input [(ngModel)]="newDevice.location" name="dloc" placeholder="Location" />
          <input [(ngModel)]="newDevice.type" name="dtype" placeholder="Type" />
          <select [(ngModel)]="newDevice.status" name="dstatus">
            <option value="online">online</option>
            <option value="offline">offline</option>
            <option value="maintenance">maintenance</option>
          </select>
          <button (click)="addDevice()">Add</button>
        </div>
      </div>

      <div class="card" *ngIf="user">
        <h2>Maintenance Tasks</h2>
        <button (click)="loadTasks()">Reload Tasks</button>

        <table class="table" *ngIf="tasks.length">
          <thead>
            <tr>
              <th>Title</th>
              <th>Device</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th *ngIf="user.role === 'admin'">Actions</th>
              <th *ngIf="user.role === 'technician'">Update</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tasks">
              <td>{{ t.title }}</td>
              <td>{{ t.device?.name }}</td>
              <td>{{ t.device?.location }}</td>
              <td>
                <span class="badge" [ngClass]="'badge ' + t.priority">
                  {{ t.priority }}
                </span>
              </td>
              <td>
                <span class="badge" [ngClass]="'badge status-' + t.status.replace(' ', '-')">
                  {{ t.status }}
                </span>
              </td>
              <td>{{ t.assignedTo?.name || '-' }}</td>
              <td *ngIf="user.role === 'admin'">
                <button class="secondary" (click)="setStatus(t, 'open')">Open</button>
                <button class="secondary" (click)="setStatus(t, 'in-progress')">In progress</button>
                <button class="secondary" (click)="setStatus(t, 'completed')">Complete</button>
              </td>
              <td *ngIf="user.role === 'technician'">
                <button class="secondary" (click)="cycleStatus(t)">Next Status</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!tasks.length">No tasks yet.</p>

        <div *ngIf="user.role === 'admin'" style="margin-top: 12px;">
          <h3>Create Task</h3>
          <input [(ngModel)]="newTask.title" name="ttitle" placeholder="Title" />
          <input [(ngModel)]="newTask.description" name="tdesc" placeholder="Description" />
          <select [(ngModel)]="newTask.deviceId" name="tdevice">
            <option value="">Select Device</option>
            <option *ngFor="let d of devices" [value]="d._id">
              {{ d.name }} ({{ d.location }})
            </option>
          </select>
          <select [(ngModel)]="newTask.priority" name="tpriority">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button (click)="createTask()">Create</button>
        </div>

        <p *ngIf="error" style="color:#fca5a5; margin-top:8px;">{{ error }}</p>
      </div>
    </div>
  `
})
export class AppComponent {
  backendUrl = 'http://localhost:4000';

  loginEmail = '';
  loginPassword = '';
  user: User | null = null;
  error = '';

  devices: Device[] = [];
  tasks: Task[] = [];

  newDevice: Partial<Device> = {
    name: '',
    location: '',
    type: '',
    status: 'online'
  };

  newTask: any = {
    title: '',
    description: '',
    deviceId: '',
    priority: 'medium'
  };

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('ll_token');
    const userJson = localStorage.getItem('ll_user');
    if (token && userJson) {
      this.user = JSON.parse(userJson);
      this.loadDevices();
      this.loadTasks();
    }
  }

  login() {
    this.error = '';
    this.http
      .post<any>(`${this.backendUrl}/api/auth/login`, {
        email: this.loginEmail,
        password: this.loginPassword
      })
      .subscribe({
        next: (res) => {
          localStorage.setItem('ll_token', res.token);
          localStorage.setItem('ll_user', JSON.stringify(res.user));
          this.user = res.user;
          this.loginEmail = '';
          this.loginPassword = '';
          this.loadDevices();
          this.loadTasks();
        },
        error: (err) => {
          this.error = err.error?.error || 'Login failed';
        }
      });
  }

  logout() {
    localStorage.removeItem('ll_token');
    localStorage.removeItem('ll_user');
    this.user = null;
    this.devices = [];
    this.tasks = [];
  }

  loadDevices() {
    this.http.get<Device[]>(`${this.backendUrl}/api/devices`).subscribe({
      next: (data) => {
        this.devices = data;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load devices';
      }
    });
  }

  addDevice() {
    if (!this.newDevice.name || !this.newDevice.location || !this.newDevice.type) {
      this.error = 'Device name, location and type are required';
      return;
    }
    this.http.post<Device>(`${this.backendUrl}/api/devices`, this.newDevice).subscribe({
      next: (d) => {
        this.devices.unshift(d);
        this.newDevice = {
          name: '',
          location: '',
          type: '',
          status: 'online'
        };
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to add device';
      }
    });
  }

  seedDevices() {
    this.http.post<any>(`${this.backendUrl}/api/devices/seed`, {}).subscribe({
      next: () => {
        this.loadDevices();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to seed devices';
      }
    });
  }

  loadTasks() {
    this.http.get<Task[]>(`${this.backendUrl}/api/tasks`).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load tasks';
      }
    });
  }

  createTask() {
    if (!this.newTask.title || !this.newTask.deviceId) {
      this.error = 'Task title and device are required';
      return;
    }
    this.http.post<Task>(`${this.backendUrl}/api/tasks`, this.newTask).subscribe({
      next: (t) => {
        this.tasks.unshift(t);
        this.newTask = {
          title: '',
          description: '',
          deviceId: '',
          priority: 'medium'
        };
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to create task';
      }
    });
  }

  setStatus(task: Task, status: 'open' | 'in-progress' | 'completed') {
    this.http
      .put<Task>(`${this.backendUrl}/api/tasks/${task._id}`, { status })
      .subscribe({
        next: (updated) => {
          const idx = this.tasks.findIndex((t) => t._id === updated._id);
          if (idx >= 0) {
            this.tasks[idx] = updated;
          }
        },
        error: (err) => {
          this.error = err.error?.error || 'Failed to update status';
        }
      });
  }

  cycleStatus(task: Task) {
    const order: Task['status'][] = ['open', 'in-progress', 'completed'];
    const currentIndex = order.indexOf(task.status);
    const next = order[(currentIndex + 1) % order.length];
    this.setStatus(task, next);
  }
}
