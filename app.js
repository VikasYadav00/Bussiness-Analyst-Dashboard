/**
 * ApexFlow Executive Command Engine
 * Enterprise Architecture: ES6 Class Controller, Chart Registry, Accessible View Router
 * @author Senior Software Engineering Team
 */

class ApexFlowEngine {
  constructor() {
    this.state = {
      activeView: 'dashboard',
      currentSlide: 1,
      totalSlides: 8,
      ragFilter: 'all',
      regionFilter: 'all'
    };

    this.viewTitles = {
      dashboard: 'CEO Command Dashboard',
      deck: 'Executive Presentation Deck (8 Slides)',
      revenue: 'Revenue & Runway Sensitivity Analysis',
      sales: 'Sales Pipeline & Marketing CAC Unit Economics',
      customers: 'Customer Success Roster & At-Risk Account Audit'
    };

    this.charts = {};
  }

  /**
   * Application Initialization
   */
  init() {
    this.initViewRouter();
    this.initSlideDeck();
    this.initFilterEngine();
    this.initChartRegistry();
    this.initInsightActions();
  }

  /**
   * 1. View Router & Sidebar Navigation
   */
  initViewRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const viewPanels = document.querySelectorAll('.view-panel');
    const pageTitleEl = document.getElementById('active-view-title');

    const switchView = (targetView) => {
      if (!this.viewTitles[targetView]) return;

      this.state.activeView = targetView;

      // Update sidebar nav links state
      navLinks.forEach(link => {
        const isSelected = link.getAttribute('data-view-target') === targetView;
        link.classList.toggle('active', isSelected);
        if (isSelected) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      // Update active view panel
      viewPanels.forEach(panel => {
        const isActive = panel.id === `view-${targetView}`;
        panel.classList.toggle('active', isActive);
      });

      // Update document & page header title
      if (pageTitleEl) {
        pageTitleEl.textContent = this.viewTitles[targetView];
      }

      // Reset presentation slide deck to slide 1 if deck view opened
      if (targetView === 'deck') {
        this.updateSlide(1);
      }
    };

    // Nav link click binding
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view-target');
        switchView(targetView);
      });
    });

    // Hash navigation support
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && this.viewTitles[hash]) {
        switchView(hash);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  /**
   * 2. Presentation Deck Controller (Slides 1 to 8)
   */
  initSlideDeck() {
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');
    const jumpSelect = document.getElementById('select-slide-jump');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.updateSlide(this.state.currentSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.updateSlide(this.state.currentSlide + 1);
      });
    }

    if (jumpSelect) {
      jumpSelect.addEventListener('change', (e) => {
        this.updateSlide(parseInt(e.target.value, 10));
      });
    }

    // Keyboard arrow accessibility navigation
    document.addEventListener('keydown', (e) => {
      if (this.state.activeView === 'deck') {
        if (e.key === 'ArrowLeft') this.updateSlide(this.state.currentSlide - 1);
        if (e.key === 'ArrowRight') this.updateSlide(this.state.currentSlide + 1);
      }
    });
  }

  updateSlide(slideNum) {
    if (slideNum < 1 || slideNum > this.state.totalSlides) return;

    const slidePanes = document.querySelectorAll('.slide-pane');
    slidePanes.forEach(pane => pane.classList.remove('active'));

    const targetPane = document.getElementById(`slide-pane-${slideNum}`);
    if (targetPane) {
      targetPane.classList.add('active');
      this.state.currentSlide = slideNum;

      const indicator = document.getElementById('slide-indicator');
      const prevBtn = document.getElementById('btn-prev-slide');
      const nextBtn = document.getElementById('btn-next-slide');
      const jumpSelect = document.getElementById('select-slide-jump');

      if (indicator) indicator.textContent = `Slide ${this.state.currentSlide} of ${this.state.totalSlides}`;
      if (prevBtn) prevBtn.disabled = this.state.currentSlide === 1;
      if (nextBtn) nextBtn.disabled = this.state.currentSlide === this.state.totalSlides;
      if (jumpSelect) jumpSelect.value = slideNum;
    }
  }

  /**
   * 3. RAG Metric Filter Engine
   */
  initFilterEngine() {
    const ragSelect = document.getElementById('rag-filter-select');
    if (!ragSelect) return;

    ragSelect.addEventListener('change', (e) => {
      const filter = e.target.value;
      this.state.ragFilter = filter;

      const metricCards = document.querySelectorAll('#view-dashboard .metric-card');
      metricCards.forEach(card => {
        const cardRag = card.getAttribute('data-rag-status');
        if (filter === 'all' || cardRag === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  /**
   * 3.5 Interactive Action Items on Slide 5
   */
  initInsightActions() {
    const actionButtons = document.querySelectorAll('.btn-insight-action');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('approved')) return;

        btn.classList.add('approved');
        btn.innerHTML = '✓ Approved & Scheduled';
        
        // Show interactive feedback
        const card = btn.closest('.insight-card');
        if (card) {
          card.style.borderColor = 'var(--color-status-green)';
          
          // Toast or simple popup notification
          const toast = document.createElement('div');
          toast.style.position = 'fixed';
          toast.style.bottom = '20px';
          toast.style.right = '20px';
          toast.style.background = '#10B981';
          toast.style.color = '#FFFFFF';
          toast.style.padding = '10px 16px';
          toast.style.borderRadius = '6px';
          toast.style.fontSize = '0.8rem';
          toast.style.fontWeight = '600';
          toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          toast.style.zIndex = '1000';
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px)';
          toast.style.transition = 'all 0.3s ease';
          
          const actionText = btn.getAttribute('data-action-text') || 'Action';
          toast.textContent = `🚀 "${actionText}" approved & scheduled for execution.`;
          
          document.body.appendChild(toast);
          
          // Trigger entry animation
          setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
          }, 50);
          
          // Auto remove
          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
          }, 3000);
        }
      });
    });
  }

  /**
   * 4. Chart Registry & Lifecycle Management
   */
  initChartRegistry() {
    if (typeof Chart === 'undefined') return;

    // Design System Chart Defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#94A3B8';

    // Chart 1: Q4 Revenue Divergence
    const revCtx = document.getElementById('chart-revenue-divergence');
    if (revCtx) {
      this.charts.revenue = new Chart(revCtx, {
        type: 'bar',
        data: {
          labels: ['October', 'November', 'December'],
          datasets: [
            {
              label: 'Pipeline (₹ Cr)',
              data: [6.2, 7.0, 8.1],
              backgroundColor: 'rgba(59, 130, 246, 0.4)',
              borderColor: '#3B82F6',
              borderWidth: 2,
              borderRadius: 6,
              yAxisID: 'y'
            },
            {
              label: 'Closed Won ARR (₹ Cr)',
              data: [1.4, 1.6, 1.3],
              backgroundColor: 'rgba(16, 185, 129, 0.6)',
              borderColor: '#10B981',
              borderWidth: 2,
              borderRadius: 6,
              yAxisID: 'y'
            },
            {
              label: 'Win Rate (%)',
              data: [23, 22, 16],
              type: 'line',
              borderColor: '#EF4444',
              backgroundColor: '#EF4444',
              borderWidth: 3,
              pointRadius: 6,
              pointBackgroundColor: '#EF4444',
              pointBorderColor: '#FFFFFF',
              pointBorderWidth: 2,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#94A3B8', font: { size: 11 } }
            },
            tooltip: {
              backgroundColor: '#162238',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              ticks: { color: '#64748B', font: { size: 11 } },
              grid: { color: 'rgba(255, 255, 255, 0.04)' }
            },
            y: {
              type: 'linear',
              position: 'left',
              ticks: { color: '#64748B', callback: val => '₹' + val + 'Cr' },
              grid: { color: 'rgba(255, 255, 255, 0.04)' }
            },
            y1: {
              type: 'linear',
              position: 'right',
              ticks: { color: '#EF4444', callback: val => val + '%' },
              grid: { drawOnChartArea: false }
            }
          }
        }
      });
    }

    // Chart 2: GTM Marketing Channel CAC ROI
    const mktCtx = document.getElementById('chart-marketing-cac');
    if (mktCtx) {
      this.charts.marketing = new Chart(mktCtx, {
        type: 'doughnut',
        data: {
          labels: ['Webinars (₹26.7k/SQL)', 'Google Ads (₹45.0k/SQL)', 'LinkedIn Ads (₹57.9k/SQL)'],
          datasets: [{
            data: [30, 40, 38],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#94A3B8', font: { size: 10 } }
            }
          }
        }
      });
    }

    // Chart 3: Customer Health Score Radial Gauge
    const healthCtx = document.getElementById('chart-health-gauge');
    if (healthCtx) {
      this.charts.health = new Chart(healthCtx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [71, 29],
            backgroundColor: ['#F59E0B', 'rgba(255, 255, 255, 0.06)'],
            borderWidth: 0,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          rotation: 235,
          circumference: 250,
          cutout: '80%',
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      });
    }
  }
}

// Instantiate and launch application engine on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const engine = new ApexFlowEngine();
  engine.init();
});
