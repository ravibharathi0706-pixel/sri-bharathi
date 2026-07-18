// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) {
            a.classList.add('active');
        }
    });
});

// Animated counter
const stats = document.querySelectorAll('.stat-number');
let counted = false;

const animateCounter = () => {
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;

        const update = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(update);
            } else {
                stat.textContent = target + '+';
            }
        };
        update();
    });
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
            counted = true;
            animateCounter();
        }
    });
}, { threshold: 0.5 });

if (stats.length) {
    observer.observe(stats[0].closest('.about-stats'));
}

// Contact form
const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = {
        name: form.querySelector('input[type="text"]').value.trim(),
        email: form.querySelector('input[type="email"]').value.trim(),
        subject: form.querySelector('input[placeholder="Subject"]').value.trim(),
        message: form.querySelector('textarea').value.trim()
    };

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            btn.textContent = 'Message Sent!';
            btn.style.background = '#22c55e';
            form.reset();
        } else {
            btn.textContent = 'Error - Try Again';
            btn.style.background = '#dc2626';
        }
    } catch {
        btn.textContent = 'Network Error';
        btn.style.background = '#dc2626';
    }

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
});

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
    }
});
