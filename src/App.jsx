import { useMemo, useState } from 'react';
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import './App.css';

import {
  EmployeeProvider,
  useEmployees,
} from './context/EmployeeContext';

function App() {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <EmployeeDashboard />
      </EmployeeProvider>
    </BrowserRouter>
  );
}

function EmployeeDashboard() {
  const {
    employees,
    setEmployees,
    isLoading,          
    error,
  } = useEmployees();

  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: 'Development',
    status: 'Active',
  });

  const location = useLocation();

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department))],
    [employees]
  );

  const activeCount = employees.filter(
    (employee) => employee.status === 'Active'
  ).length;

  const leaveCount = employees.filter(
    (employee) => employee.status === 'On Leave'
  ).length;

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) ||
      employee.email.toLowerCase().includes(searchText) ||
      employee.department.toLowerCase().includes(searchText);

    const matchesDepartment =
      departmentFilter === 'All' ||
      employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  function openAddForm() {
    setEditingEmployee(null);

    setForm({
      name: '',
      email: '',
      department: 'Development',
      status: 'Active',
    });

    setFormError('');
    setShowForm(true);
  }

  function openEditForm(employee) {
    setEditingEmployee(employee);

    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      status: employee.status,
    });

    setFormError('');
    setShowForm(true);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email) {
      setFormError('Please enter the employee name and email.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setFormError('Please enter an email address in a valid format.');
      return;
    }

    const duplicateEmail = employees.some(
      (employee) =>
        employee.email.toLowerCase() === email &&
        employee.id !== editingEmployee?.id
    );

    if (duplicateEmail) {
      setFormError(
        'This email address is already in the employee list.'
      );
      return;
    }

    const employeeDetails = {
      name,
      email,
      department: form.department,
      status: form.status,
    };

    if (editingEmployee) {
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === editingEmployee.id
            ? { ...employee, ...employeeDetails }
            : employee
        )
      );

      setNotice('Employee details updated successfully.');
    } else {
      setEmployees((current) => [
        ...current,
        {
          id: Date.now(),
          ...employeeDetails,
        },
      ]);

      setNotice('Employee added successfully.');
    }

    setShowForm(false);
    setFormError('');
  }

  function deleteEmployee(id) {
    const employee = employees.find((item) => item.id === id);

    if (!employee) return;

    if (window.confirm(`Delete ${employee.name} from the employee list?`)) {
      setEmployees((current) =>
        current.filter((item) => item.id !== id)
      );

      setNotice('Employee deleted successfully.');
    }
  }

  const currentPage = location.pathname;

  const pageTitle =
    currentPage === '/employees'
      ? 'Employees'
      : currentPage === '/departments'
        ? 'Departments'
        : currentPage === '/settings'
          ? 'Settings'
          : 'Dashboard';

  if (isLoading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        <div className="loader" aria-hidden="true"></div>
        <p>Loading Nexora dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <aside className="sidebar">
        <NavLink to="/" className="logo">
          Nexora<span>.</span>
        </NavLink>

        <p className="menu-title">WORKSPACE</p>

        <NavLink to="/" end className="menu">
          <span className="menu-icon">▦</span> Dashboard
        </NavLink>

        <NavLink to="/employees" className="menu">
          <span className="menu-icon">♙</span> Employees
        </NavLink>

        <NavLink to="/departments" className="menu">
          <span className="menu-icon">▤</span> Departments
        </NavLink>

        <p className="menu-title second-menu-title">PREFERENCES</p>

        <NavLink to="/settings" className="menu">
          <span className="menu-icon">⚙</span> Settings
        </NavLink>

        <div className="sidebar-bottom">
          <div className="avatar">AA</div>

          <div>
            <strong>Aqib Ali</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">NEXORA WORKSPACE</p>
            <h1>{pageTitle}</h1>
            <p className="subtitle">
              Welcome back! Manage your team in one place.
            </p>
          </div>

          <div className="topbar-actions">
            <button
              className="theme-btn"
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button
              className="add-btn"
              type="button"
              onClick={openAddForm}
            >
              ＋ Add Employee
            </button>
          </div>
        </header>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="notice" role="status">
            <span>✓ {notice}</span>

            <button
              type="button"
              onClick={() => setNotice('')}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                employees={employees}
                activeCount={activeCount}
                leaveCount={leaveCount}
                departments={departments}
                onAdd={openAddForm}
                onEdit={openEditForm}
                onDelete={deleteEmployee}
              />
            }
          />

          <Route
            path="/employees"
            element={
              <EmployeesPage
                employees={filteredEmployees}
                allEmployees={employees}
                search={search}
                setSearch={setSearch}
                departmentFilter={departmentFilter}
                setDepartmentFilter={setDepartmentFilter}
                departments={departments}
                onEdit={openEditForm}
                onDelete={deleteEmployee}
                onAdd={openAddForm}
              />
            }
          />

          <Route
            path="/departments"
            element={
              <DepartmentsPage
                employees={employees}
                departments={departments}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <SettingsPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                employeeCount={employees.length}
              />
            }
          />

          <Route
            path="*"
            element={
              <section className="panel empty-state">
                <div className="empty-icon">🔎</div>
                <h2>Page not found</h2>
                <p>The page you're looking for doesn't exist.</p>

                <NavLink className="add-btn inline-button" to="/">
                  Back to Dashboard
                </NavLink>
              </section>
            }
          />
        </Routes>

        <footer>
          © 2026 Nexora Dashboard · Built with React
        </footer>
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">EMPLOYEE MANAGEMENT</p>

                <h2 id="form-title">
                  {editingEmployee
                    ? 'Edit employee'
                    : 'Add new employee'}
                </h2>

                <p className="subtitle">
                  Enter the employee information below.
                </p>
              </div>

              <button
                className="close-btn"
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <label htmlFor="employee-name">Full name</label>

              <input
                id="employee-name"
                type="text"
                placeholder="e.g. Aqib Ali"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                required
              />

              <label htmlFor="employee-email">Email address</label>

              <input
                id="employee-email"
                type="email"
                placeholder="name@gmail.com"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                required
              />

              <label htmlFor="employee-department">Department</label>

              <select
                id="employee-department"
                value={form.department}
                onChange={(event) =>
                  setForm({
                    ...form,
                    department: event.target.value,
                  })
                }
              >
                <option>Development</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Human Resources</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Sales</option>
              </select>

              <label htmlFor="employee-status">Status</label>

              <select
                id="employee-status"
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value,
                  })
                }
              >
                <option>Active</option>
                <option>On Leave</option>
              </select>

              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="add-btn">
                  {editingEmployee
                    ? 'Save Changes'
                    : 'Add Employee'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function DashboardPage({
  employees,
  activeCount,
  leaveCount,
  departments,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <section className="welcome-card">
        <div>
          <span className="welcome-label">YOUR WORKSPACE</span>

          <h2>
            Manage your team,
            <br />
            achieve more.
          </h2>

          <p>
            Everything you need to manage your employees in one place.
          </p>

          <button
            className="banner-btn"
            type="button"
            onClick={onAdd}
          >
            + Add your team member
          </button>
        </div>

        <div className="welcome-icon">✦</div>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon="♙"
          color="purple"
          note="People in your team"
        />

        <StatCard
          title="Departments"
          value={departments.length.toString().padStart(2, '0')}
          icon="▦"
          color="blue"
          note="Unique departments"
        />

        <StatCard
          title="Active Employees"
          value={activeCount}
          icon="✓"
          color="green"
          note="Currently active"
        />

        <StatCard
          title="On Leave"
          value={leaveCount}
          icon="◷"
          color="orange"
          note="Currently on leave"
        />
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Team members</h2>
            <p>Your employee directory at a glance.</p>
          </div>

          <NavLink to="/employees" className="view-btn">
            View all →
          </NavLink>
        </div>

        <EmployeeTable
          employees={employees.slice(0, 5)}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions
        />
      </section>
    </>
  );
}

function StatCard({ title, value, icon, color, note }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className={`stat-icon ${color}`}>{icon}</span>
      </div>

      <h2>{value}</h2>
      <p className="muted">{note}</p>
    </article>
  );
}

function EmployeesPage({
  employees,
  allEmployees,
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  departments,
  onEdit,
  onDelete,
  onAdd,
}) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>All employees</h2>
          <p>
            {allEmployees.length} employee records in your directory.
          </p>
        </div>

        <button
          className="add-btn"
          type="button"
          onClick={onAdd}
        >
          ＋ Add Employee
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search name, email, department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search employees"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(event) =>
            setDepartmentFilter(event.target.value)
          }
          aria-label="Filter by department"
          className="filter-select"
        >
          <option value="All">All departments</option>

          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      {employees.length > 0 ? (
        <EmployeeTable
          employees={employees}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions
        />
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <h2>No employees found</h2>
          <p>Try another search or department filter.</p>

          <button
            className="view-btn"
            type="button"
            onClick={() => {
              setSearch('');
              setDepartmentFilter('All');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  showActions = false,
}) {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h2>No employees yet</h2>
        <p>Add your first employee to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="employee-table">
        <thead>
          <tr>
            <th>EMPLOYEE</th>
            <th>DEPARTMENT</th>
            <th>STATUS</th>
            {showActions && <th>ACTIONS</th>}
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <td>
                <div className="employee-info">
                  <div
                    className={`person-avatar avatar-color-${index % 3}`}
                  >
                    {employee.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="employee-text">
                    <strong>{employee.name}</strong>
                    <small>{employee.email}</small>
                  </div>
                </div>
              </td>

              <td>{employee.department}</td>

              <td>
                <span
                  className={`status ${
                    employee.status === 'Active'
                      ? 'active-status'
                      : 'leave-status'
                  }`}
                >
                  {employee.status}
                </span>
              </td>

              {showActions && (
                <td>
                  <div className="row-actions">
                    <button
                      className="action-btn edit-action"
                      type="button"
                      onClick={() => onEdit(employee)}
                      aria-label={`Edit ${employee.name}`}
                      title="Edit employee"
                    >
                      ✎
                    </button>

                    <button
                      className="action-btn delete-action"
                      type="button"
                      onClick={() => onDelete(employee.id)}
                      aria-label={`Delete ${employee.name}`}
                      title="Delete employee"
                    >
                      ×
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DepartmentsPage({ employees, departments }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Departments</h2>
          <p>Explore your team's departments and headcount.</p>
        </div>
      </div>

      {departments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <h2>No departments yet</h2>
          <p>Add an employee to create a department listing.</p>
        </div>
      ) : (
        <div className="department-grid">
          {departments.map((department, index) => {
            const members = employees.filter(
              (employee) => employee.department === department
            );

            const percentage = employees.length
              ? (members.length / employees.length) * 100
              : 0;

            return (
              <article
                className="department-card"
                key={department}
              >
                <div
                  className={`department-icon avatar-color-${index % 3}`}
                >
                  {department.slice(0, 1).toUpperCase()}
                </div>

                <h3>{department}</h3>

                <p>
                  {members.length}{' '}
                  {members.length === 1 ? 'employee' : 'employees'}
                </p>

                <div className="department-progress">
                  <span style={{ width: `${percentage}%` }} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SettingsPage({ darkMode, setDarkMode, employeeCount }) {
  return (
    <section className="panel settings-panel">
      <div className="section-heading">
        <div>
          <h2>Preferences</h2>
          <p>Personalize your Nexora workspace.</p>
        </div>
      </div>

      <div className="setting-row">
        <div>
          <strong>Dark mode</strong>
          <p>Switch between light and dark appearance.</p>
        </div>

        <button
          className={`toggle ${darkMode ? 'toggle-on' : ''}`}
          type="button"
          onClick={() => setDarkMode((current) => !current)}
          role="switch"
          aria-checked={darkMode}
          aria-label="Dark mode"
        >
          <span />
        </button>
      </div>

      <div className="setting-row">
        <div>
          <strong>Employee records</strong>
          <p>
            Your current directory contains {employeeCount} records.
          </p>
        </div>

        <span className="status active-status">Saved locally</span>
      </div>

      <div className="info-note">
        <strong>About this project</strong>
        <p>
          Nexora is an Employee Management Dashboard built with React,
          React Router, Context API, and CSS. Employee changes are saved
          in this browser using local storage.
        </p>
      </div>
    </section>
  );
}

export default App;