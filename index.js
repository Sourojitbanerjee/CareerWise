let currentStep = 1;
        let assessmentData = {};
        
        // API Base URL
        const API_BASE = 'http://localhost:3000/api';
        
        // Start Assessment
        function startAssessment() {
            document.getElementById('assessmentForm').style.display = 'block';
            document.getElementById('assessmentForm').scrollIntoView({ behavior: 'smooth' });
            updateProgress(1);
        }
        
        // Navigation Functions
        function nextStep(step) {
            if (validateStep(currentStep)) {
                document.getElementById(`step${currentStep}`).style.display = 'none';
                document.getElementById(`step${step}`).style.display = 'block';
                currentStep = step;
                updateProgress(step);
            }
        }
        
        function prevStep(step) {
            document.getElementById(`step${currentStep}`).style.display = 'none';
            document.getElementById(`step${step}`).style.display = 'block';
            currentStep = step;
            updateProgress(step);
        }
        
        function updateProgress(step) {
            const progress = (step / 3) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }
        
        function validateStep(step) {
            const stepElement = document.getElementById(`step${step}`);
            const requiredInputs = stepElement.querySelectorAll('[required]');
            
            for (let input of requiredInputs) {
                if (!input.value) {
                    alert('Please fill all required fields');
                    return false;
                }
            }
            return true;
        }
        
        // Form Submission
        document.getElementById('careerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const spinner = document.querySelector('.loading-spinner');
            spinner.style.display = 'inline-block';
            
            // Collect form data
            const formData = new FormData(this);
            const data = {};
            
            // Handle regular form fields
            for (let [key, value] of formData.entries()) {
                if (key === 'interests') {
                    if (!data[key]) data[key] = [];
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
            
            try {
                const response = await fetch(`${API_BASE}/assessment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    assessmentData = result;
                    showResults(result);
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                // Show demo results for prototype
                showDemoResults(data);
            }
            
            spinner.style.display = 'none';
        });
        
        function showResults(data) {
            document.getElementById('results').style.display = 'block';
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            
            const container = document.getElementById('recommendationsContainer');
            container.innerHTML = `
                <div class="row">
                    ${data.recommendations.map(career => `
                        <div class="col-lg-6 mb-4">
                            <div class="career-card">
                                <h5><i class="fas fa-briefcase me-2"></i>${career.title}</h5>
                                <p class="text-muted mb-3">${career.description}</p>
                                <div class="mb-3">
                                    <strong>Salary Range:</strong> ${career.salary}
                                </div>
                                <div class="mb-3">
                                    <strong>Required Skills:</strong><br>
                                    ${career.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                                <div class="mb-3">
                                    <strong>Match Score:</strong> 
                                    <span class="badge bg-success">${career.match}%</span>
                                </div>
                                <button class="btn btn-gradient btn-sm" onclick="viewCareerDetails('${career.id}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        function showDemoResults(userData) {
            const demoRecommendations = [
                {
                    id: 'software-developer',
                    title: 'Software Developer',
                    description: 'Design and develop software applications and systems',
                    salary: '$70,000 - $120,000',
                    skills: ['Programming', 'Problem Solving', 'Teamwork', 'Communication'],
                    match: 92
                },
                {
                    id: 'data-scientist',
                    title: 'Data Scientist',
                    description: 'Analyze complex data to help organizations make informed decisions',
                    salary: '$85,000 - $130,000',
                    skills: ['Statistics', 'Python/R', 'Machine Learning', 'Data Visualization'],
                    match: 87
                },
                {
                    id: 'ux-designer',
                    title: 'UX/UI Designer',
                    description: 'Create user-friendly interfaces and improve user experience',
                    salary: '$60,000 - $100,000',
                    skills: ['Design Thinking', 'Prototyping', 'User Research', 'Creativity'],
                    match: 81
                }
            ];
            
            showResults({ recommendations: demoRecommendations });
        }
        
        // Load Career Database
        async function loadCareers() {
    try {
        const response = await fetch(`${API_BASE}/careers`);
        const careers = await response.json();
        displayCareers(careers);
    } catch (error) {
        console.error('Error loading careers:', error);
        
        // Show demo careers if API fails
        const demoCareers = [
            {
                id: 1,
                title: 'Software Engineer',
                category: 'Technology',
                description: 'Designs, develops, and maintains software applications and systems.',
                skills: ['JavaScript', 'Problem Solving', 'Teamwork'],
                averageSalary: '₹6–12 LPA',
                educationPath: 'B.Tech in CSE / IT or related fields'
            },
            {
                id: 2,
                title: 'Data Scientist',
                category: 'Analytics',
                description: 'Analyzes complex data to extract insights and build predictive models.',
                skills: ['Python', 'Machine Learning', 'Statistics'],
                averageSalary: '₹8–18 LPA',
                educationPath: 'B.Sc/M.Sc in Data Science, Statistics, or Engineering'
            },
            {
                id: 3,
                title: 'Civil Engineer',
                category: 'Engineering',
                description: 'Plans, designs, and oversees construction projects like roads, bridges, and buildings.',
                skills: ['AutoCAD', 'Structural Analysis', 'Project Management'],
                averageSalary: '₹4–10 LPA',
                educationPath: 'B.Tech in Civil Engineering'
            },
            {
                id: 4,
                title: 'Teacher',
                category: 'Education',
                description: 'Educates and mentors students in schools or colleges.',
                skills: ['Communication', 'Subject Knowledge', 'Classroom Management'],
                averageSalary: '₹3–6 LPA',
                educationPath: 'B.Ed / M.Ed + subject specialization'
            }
        ];

        displayCareers(demoCareers);
    }
}