import { AuthService } from '../core/auth.js';
import { Router } from '../router.js';

export function renderAuthPage(container, path) {
    container.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-card-container">
                <div class="auth-card" id="auth-card">
                    <!-- FRONT: LOGIN -->
                    <div class="auth-face auth-front">
                        <div class="auth-header">
                            <h1 class="brand-title">ITERIQ</h1>
                            <p class="institution-tag">Bells University of Technology, Ota</p>
                            <h2>Sign In</h2>
                            <p class="auth-subtitle">Verify your campus presence and academic attendance.</p>
                        </div>
                        <form id="login-form" class="auth-form">
                            <div class="form-group">
                                <label>Portal Role</label>
                                <select id="login-role" class="form-input">
                                    <option value="STUDENT">Student</option>
                                    <option value="COURSE_REPRESENTATIVE">Course Representative</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>University Email</label>
                                <input type="email" id="login-email" class="form-input" placeholder="student@bellsuniversity.edu.ng" required />
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="login-password" class="form-input" placeholder="••••••••" required />
                            </div>
                            <div id="login-error" style="color: var(--color-error); font-size: 12px; display: none;"></div>
                            <button type="submit" class="btn-primary" id="login-submit-btn">Access Portal</button>
                        </form>
                        <div class="auth-switch-prompt">
                            Don't have an account? <button type="button" id="flip-to-register" class="link-btn">Register here</button>
                        </div>
                    </div>

                    <!-- BACK: REGISTRATION -->
                    <div class="auth-face auth-back">
                        <div class="auth-header">
                            <h1 class="brand-title">ITERIQ</h1>
                            <p class="institution-tag">Bells University of Technology, Ota</p>
                            <h2>Create Account</h2>
                            <p class="auth-subtitle">Establish your secure verified academic profile.</p>
                        </div>
                        <form id="register-form" class="auth-form">
                            <div class="form-group">
                                <label>Account Role</label>
                                <select id="reg-role" class="form-input">
                                    <option value="STUDENT">Student</option>
                                    <option value="COURSE_REPRESENTATIVE">Course Representative</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="reg-name" class="form-input" placeholder="Oluwaseun Adekunle" required />
                            </div>
                            <div id="student-reg-fields">
                                <div class="form-group">
                                    <label>Matriculation Number</label>
                                    <input type="text" id="reg-matric" class="form-input" placeholder="BU/22/CSC/1092" />
                                </div>
                                <div class="form-group">
                                    <label>Academic Level</label>
                                    <select id="reg-level" class="form-input">
                                        <option value="100 Level">100 Level</option>
                                        <option value="200 Level">200 Level</option>
                                        <option value="300 Level">300 Level</option>
                                        <option value="400 Level">400 Level</option>
                                        <option value="500 Level">500 Level</option>
                                    </select>
                                </div>
                            </div>
                            <div id="rep-reg-fields" style="display: none;">
                                <div class="form-group">
                                    <label>Course Represented (e.g., CSC 301)</label>
                                    <input type="text" id="reg-course" class="form-input" placeholder="CSC 301" />
                                </div>
                                <div class="form-group">
                                    <label>Academic Level</label>
                                    <select id="reg-rep-level" class="form-input">
                                        <option value="100 Level">100 Level</option>
                                        <option value="200 Level">200 Level</option>
                                        <option value="300 Level">300 Level</option>
                                        <option value="400 Level">400 Level</option>
                                        <option value="500 Level">500 Level</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Private Registration Access Code</label>
                                    <input type="password" id="reg-code" class="form-input" placeholder="Enter secure access code" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>University Email</label>
                                <input type="email" id="reg-email" class="form-input" placeholder="student@bellsuniversity.edu.ng" required />
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="reg-password" class="form-input" placeholder="••••••••" required />
                            </div>
                            <div id="reg-error" style="color: var(--color-error); font-size: 12px; display: none;"></div>
                            <div id="reg-success" style="color: var(--color-success); font-size: 12px; display: none;"></div>
                            <button type="submit" class="btn-primary" id="reg-submit-btn">Complete Registration</button>
                        </form>
                        <div class="auth-switch-prompt">
                            Already registered? <button type="button" id="flip-to-login" class="link-btn">Sign in here</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .auth-wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: var(--color-primary-dark); padding: 20px; perspective: 1000px; }
            .auth-card-container { width: 100%; max-width: 460px; }
            .auth-card { position: relative; width: 100%; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1); }
            .auth-card.flipped { transform: rotateY(180deg); }
            .auth-face { background: #fff; border-radius: var(--radius-smooth); padding: 40px; box-shadow: var(--shadow-card); backface-visibility: hidden; width: 100%; }
            .auth-back { position: absolute; top: 0; left: 0; transform: rotateY(180deg); max-height: 90vh; overflow-y: auto; }
            .brand-title { font-family: var(--font-serif); font-size: 36px; font-weight: 700; color: var(--color-primary); letter-spacing: 3px; margin-bottom: 2px; }
            .institution-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--color-bronze); margin-bottom: 24px; font-weight: 600; }
            .auth-header h2 { font-size: 22px; font-weight: 600; color: var(--color-text); margin-bottom: 6px; }
            .auth-subtitle { font-size: 13px; color: var(--color-text-muted); margin-bottom: 24px; }
            .auth-form { display: flex; flex-direction: column; gap: 16px; }
            .form-group { display: flex; flex-direction: column; gap: 6px; }
            .form-group label { font-size: 12px; font-weight: 600; color: var(--color-text); text-transform: uppercase; letter-spacing: 0.5px; }
            .form-input { padding: 12px 14px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; color: var(--color-text); background-color: var(--color-ivory); transition: var(--transition-smooth); }
            .form-input:focus { outline: none; border-color: var(--color-primary); background-color: #fff; box-shadow: 0 0 0 3px rgba(27, 77, 62, 0.1); }
            .btn-primary { margin-top: 8px; padding: 14px; background-color: var(--color-primary); color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: var(--transition-smooth); }
            .btn-primary:hover { background-color: var(--color-primary-light); }
            .auth-switch-prompt { margin-top: 20px; text-align: center; font-size: 13px; color: var(--color-text-muted); }
            .link-btn { background: none; border: none; color: var(--color-primary); font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0; }
        </style>
    `;

    const card = document.getElementById('auth-card');
    document.getElementById('flip-to-register').addEventListener('click', () => card.classList.add('flipped'));
    document.getElementById('flip-to-login').addEventListener('click', () => card.classList.remove('flipped'));

    const regRoleSelect = document.getElementById('reg-role');
    const studentFields = document.getElementById('student-reg-fields');
    const repFields = document.getElementById('rep-reg-fields');

    regRoleSelect.addEventListener('change', (e) => {
        if (e.target.value === 'COURSE_REPRESENTATIVE') {
            studentFields.style.display = 'none';
            repFields.style.display = 'block';
        } else {
            studentFields.style.display = 'block';
            repFields.style.display = 'none';
        }
    });

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;
        const errBox = document.getElementById('login-error');
        errBox.style.display = 'none';

        try {
            await AuthService.login(email, password, role);
            Router.navigateTo('/portal/overview');
        } catch (err) {
            errBox.textContent = err.message;
            errBox.style.display = 'block';
        }
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = regRoleSelect.value;
        const fullName = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const errBox = document.getElementById('reg-error');
        const succBox = document.getElementById('reg-success');
        errBox.style.display = 'none';
        succBox.style.display = 'none';

        try {
            if (role === 'STUDENT') {
                const matricNumber = document.getElementById('reg-matric').value;
                const academicLevel = document.getElementById('reg-level').value;
                await AuthService.registerStudent({ fullName, email, password, matricNumber, academicLevel });
                succBox.textContent = 'Student registration successful! Please sign in.';
                succBox.style.display = 'block';
                setTimeout(() => card.classList.remove('flipped'), 1500);
            } else {
                const courseCode = document.getElementById('reg-course').value;
                const academicLevel = document.getElementById('reg-rep-level').value;
                const registrationCode = document.getElementById('reg-code').value;
                await AuthService.registerRepresentative({ fullName, email, password, courseCode, academicLevel, registrationCode });
                succBox.textContent = 'Course representative registration successful! Please sign in.';
                succBox.style.display = 'block';
                setTimeout(() => card.classList.remove('flipped'), 1500);
            }
        } catch (err) {
            errBox.textContent = err.message;
            errBox.style.display = 'block';
        }
    });
}