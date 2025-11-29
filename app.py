import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime, timedelta

# Page configuration
st.set_page_config(
    page_title="Kiro Fitfin AI",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern dark mode styling
st.markdown("""
<style>
    /* Main background */
    .main {
        background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
        color: #e0e0e0;
    }
    
    /* Sidebar styling */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #16213e 0%, #0f3460 100%);
    }
    
    /* Metric cards */
    [data-testid="stMetric"] {
        background: linear-gradient(135deg, #2d2d44 0%, #1e1e3f 100%);
        padding: 20px;
        border-radius: 15px;
        border: 1px solid #3d3d5c;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
    }
    
    [data-testid="stMetric"]:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    }
    
    /* Metric labels */
    [data-testid="stMetricLabel"] {
        color: #a0a0c0;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    /* Metric values */
    [data-testid="stMetricValue"] {
        color: #00d4ff;
        font-size: 32px;
        font-weight: 700;
    }
    
    /* Headers */
    h1 {
        color: #00d4ff;
        font-weight: 800;
        text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }
    
    h2 {
        color: #00b4d8;
        font-weight: 700;
    }
    
    h3 {
        color: #90e0ef;
        font-weight: 600;
    }
    
    /* Emergency alert */
    .emergency-alert {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
        color: white;
        padding: 25px;
        border-radius: 15px;
        margin-bottom: 25px;
        border: 2px solid #ef4444;
        box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 30px rgba(220, 38, 38, 0.5); }
        50% { box-shadow: 0 0 50px rgba(220, 38, 38, 0.8); }
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background-color: #1e1e3f;
        padding: 10px;
        border-radius: 10px;
    }
    
    .stTabs [data-baseweb="tab"] {
        background-color: #2d2d44;
        border-radius: 8px;
        color: #a0a0c0;
        padding: 10px 20px;
        font-weight: 600;
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #00d4ff 0%, #0096c7 100%);
        color: white;
    }
    
    /* Progress bars */
    .stProgress > div > div > div > div {
        background: linear-gradient(90deg, #00d4ff 0%, #0096c7 100%);
    }
    
    /* Input fields */
    .stNumberInput > div > div > input,
    .stSlider > div > div > div > div {
        background-color: #2d2d44;
        color: #e0e0e0;
        border: 1px solid #3d3d5c;
        border-radius: 8px;
    }
    
    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #00d4ff 0%, #0096c7 100%);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 10px 24px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 212, 255, 0.4);
    }
    
    /* Score badge */
    .score-badge {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 18px;
        margin: 10px 0;
    }
    
    .score-excellent {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
    }
    
    .score-good {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
    }
    
    .score-fair {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
    }
    
    .score-poor {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'dark_mode' not in st.session_state:
    st.session_state.dark_mode = True

# Helper function for score badges
def get_score_badge(score):
    if score >= 80:
        return f'<span class="score-badge score-excellent">⭐ {score:.1f} - Excellent</span>'
    elif score >= 60:
        return f'<span class="score-badge score-good">✓ {score:.1f} - Good</span>'
    elif score >= 40:
        return f'<span class="score-badge score-fair">⚠ {score:.1f} - Fair</span>'
    else:
        return f'<span class="score-badge score-poor">⚡ {score:.1f} - Needs Attention</span>'

# Header with gradient
st.markdown("""
<div style="text-align: center; padding: 20px 0;">
    <h1 style="font-size: 48px; margin-bottom: 10px;">🎯 Kiro Fitfin AI</h1>
    <p style="font-size: 18px; color: #a0a0c0; font-style: italic;">
        Your unified health, fitness, finance, and personal growth mentor
    </p>
</div>
""", unsafe_allow_html=True)

# Sidebar for data input
with st.sidebar:
    st.markdown("## 📊 Quick Input")
    
    # Quick preset buttons
    st.markdown("### ⚡ Quick Start")
    col1, col2 = st.columns(2)
    with col1:
        if st.button("🎯 Average Day", use_container_width=True):
            st.session_state.preset = "average"
    with col2:
        if st.button("💪 Active Day", use_container_width=True):
            st.session_state.preset = "active"
    
    st.markdown("---")
    
    # Health Metrics
    st.markdown("### ❤️ Health & Diet")
    
    # Preset values
    if 'preset' not in st.session_state:
        st.session_state.preset = None
    
    if st.session_state.preset == "average":
        cal_default, hyd_default, sleep_default, diet_default = 2000, 2.0, 7.0, 70
    elif st.session_state.preset == "active":
        cal_default, hyd_default, sleep_default, diet_default = 2500, 3.0, 8.0, 85
    else:
        cal_default, hyd_default, sleep_default, diet_default = 2000, 2.0, 7.0, 75
    
    calories = st.number_input(
        "🍽️ Daily Calories", 
        min_value=0, max_value=5000, 
        value=cal_default,
        step=100,
        help="💡 Recommended: 1800-2500 kcal/day"
    )
    
    hydration = st.slider(
        "💧 Hydration (Liters)", 
        0.0, 5.0, hyd_default, 0.1,
        help="💡 Drink 2-3 liters daily for optimal health"
    )
    
    sleep_hours = st.slider(
        "😴 Sleep Hours", 
        0.0, 12.0, sleep_default, 0.5,
        help="💡 Aim for 7-9 hours of quality sleep"
    )
    
    diet_quality = st.slider(
        "🥗 Diet Quality", 
        0, 100, diet_default,
        help="💡 Rate: 0=Poor, 50=Average, 100=Excellent"
    )
    
    st.markdown("---")
    
    # Fitness Metrics
    st.markdown("### 💪 Fitness & Activity")
    
    if st.session_state.preset == "average":
        steps_default, exercise_default = 8000, 30
    elif st.session_state.preset == "active":
        steps_default, exercise_default = 12000, 60
    else:
        steps_default, exercise_default = 8000, 30
    
    daily_steps = st.number_input(
        "👟 Daily Steps", 
        min_value=0, max_value=50000, 
        value=steps_default,
        step=1000,
        help="💡 Target: 10,000 steps/day"
    )
    
    exercise_minutes = st.number_input(
        "⏱️ Exercise Minutes", 
        min_value=0, max_value=300, 
        value=exercise_default,
        step=5,
        help="💡 Minimum: 30 min/day, Optimal: 60 min/day"
    )
    
    st.markdown("---")
    
    # Finance Metrics
    st.markdown("### 💰 Financial Sync")
    
    home_cooked = st.number_input(
        "🏠 Home-cooked Meals", 
        min_value=0, max_value=21, 
        value=15,
        help="💡 More home cooking = Better health + savings"
    )
    
    takeout_meals = st.number_input(
        "🍕 Takeout Meals", 
        min_value=0, max_value=21, 
        value=6,
        help="💡 Try to limit takeout to save money"
    )
    
    grocery_spend = st.number_input(
        "🛒 Weekly Grocery ($)", 
        min_value=0.0, 
        value=150.0,
        step=10.0,
        help="💡 Plan meals to reduce waste"
    )
    
    st.markdown("---")
    
    # Growth Metrics
    st.markdown("### 📚 Personal Development")
    
    study_planned = st.number_input(
        "📋 Study Blocks Planned", 
        min_value=1, max_value=50, 
        value=15,
        help="💡 Plan realistic study goals"
    )
    
    study_blocks = st.number_input(
        "✅ Study Blocks Done", 
        min_value=0, 
        max_value=study_planned, 
        value=min(10, study_planned),
        help="💡 Track your progress daily"
    )
    
    st.markdown("---")
    
    # Reset button
    if st.button("🔄 Reset to Defaults", use_container_width=True):
        st.session_state.preset = None
        st.rerun()
    
    st.markdown("""
    <div style="text-align: center; padding: 10px; color: #a0a0c0; font-size: 12px;">
        <p>💡 Tip: Use Quick Start buttons for easy setup!</p>
        <p>📊 Update daily for accurate tracking</p>
    </div>
    """, unsafe_allow_html=True)

# Calculate scores
def calculate_health_score(calories, hydration, sleep, diet_quality):
    score = 0
    # Diet quality (40%)
    score += (diet_quality / 100) * 40
    # Hydration (30%)
    hydration_score = min(hydration / 2.5, 1.0) * 30
    score += hydration_score
    # Sleep (30%)
    sleep_score = min(sleep / 8.0, 1.0) * 30
    score += sleep_score
    return min(score, 100)

def calculate_fitness_score(steps, minutes):
    score = 0
    # Steps (50%)
    steps_score = min(steps / 10000, 1.0) * 50
    score += steps_score
    # Exercise minutes (50%)
    exercise_score = min(minutes / 60, 1.0) * 50
    score += exercise_score
    return min(score, 100)

def calculate_finance_score(home_cooked, takeout):
    total_meals = home_cooked + takeout
    if total_meals == 0:
        return 0
    home_cooked_ratio = home_cooked / total_meals
    return home_cooked_ratio * 100

def calculate_growth_score(completed, planned):
    if planned == 0:
        return 0
    completion_ratio = completed / planned
    return min(completion_ratio * 100, 100)

# Calculate all scores
health_score = calculate_health_score(calories, hydration, sleep_hours, diet_quality)
fitness_score = calculate_fitness_score(daily_steps, exercise_minutes)
finance_score = calculate_finance_score(home_cooked, takeout_meals)
growth_score = calculate_growth_score(study_blocks, study_planned)
overall_score = (health_score + fitness_score + finance_score + growth_score) / 4

# Welcome message for first-time users
if 'first_visit' not in st.session_state:
    st.session_state.first_visit = True

if st.session_state.first_visit:
    st.info("""
    👋 **Welcome to Kiro Fitfin AI!**
    
    Get started in 3 easy steps:
    1. 📊 Use the sidebar to input your daily metrics
    2. 🎯 Click "Quick Start" buttons for preset values
    3. 📈 Watch your scores update in real-time!
    """)
    if st.button("✅ Got it! Let's start"):
        st.session_state.first_visit = False
        st.rerun()

# Emergency Alert (if any metric is critical)
show_alert = hydration < 1.0 or sleep_hours < 5.0
if show_alert:
    st.markdown("""
    <div class="emergency-alert">
        <h3>⚠️ HEALTH ALERT</h3>
        <p><strong>Critical threshold detected!</strong> Please take action:</p>
        <ul>
            <li>💧 Drink more water if hydration is low</li>
            <li>😴 Get more sleep if under 5 hours</li>
            <li>👨‍⚕️ Consult your doctor if symptoms persist</li>
        </ul>
        <p style="margin-top: 15px;"><strong>Emergency Contact:</strong><br>
        Dr. Sarah Johnson | 📞 +1 (555) 123-4567 | 📧 dr.johnson@healthclinic.com</p>
    </div>
    """, unsafe_allow_html=True)

# Main Dashboard
st.markdown("<br>", unsafe_allow_html=True)
st.markdown("## 📈 Your LifeFitFinSync Score")
st.markdown(get_score_badge(overall_score), unsafe_allow_html=True)

# Score explanation
with st.expander("ℹ️ What does my score mean?"):
    st.markdown("""
    **Your score is calculated from 4 key areas:**
    
    - ❤️ **Health Score** - Based on calories, hydration, sleep, and diet quality
    - 💪 **Fitness Score** - Based on daily steps and exercise minutes
    - 💰 **Finance Score** - Based on home-cooked vs takeout meals
    - 📚 **Growth Score** - Based on study completion rate
    
    **Score Ranges:**
    - 🌟 80-100: Excellent! Keep it up!
    - ✅ 60-79: Good progress, room to improve
    - ⚠️ 40-59: Fair, focus on weak areas
    - ⚡ 0-39: Needs attention, start small
    """)

st.markdown("<br>", unsafe_allow_html=True)

# Score cards with icons
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("🎯 Overall Score", f"{overall_score:.1f}")
with col2:
    st.metric("❤️ Health", f"{health_score:.1f}")
with col3:
    st.metric("💪 Fitness", f"{fitness_score:.1f}")
with col4:
    st.metric("💰 Finance", f"{finance_score:.1f}")
with col5:
    st.metric("📚 Growth", f"{growth_score:.1f}")

# Detailed sections
tab1, tab2, tab3, tab4 = st.tabs(["🥗 Health", "💪 Fitness", "💰 Finance", "📚 Growth"])

with tab1:
    st.markdown("### 🥗 Diet & Health Insights")
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("🍽️ Daily Calories", f"{calories} kcal")
    with col2:
        st.metric("💧 Hydration", f"{hydration} L")
    with col3:
        st.metric("😴 Sleep Hours", f"{sleep_hours} hrs")
    with col4:
        st.metric("🥗 Diet Quality", f"{diet_quality}/100")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Health trend chart with modern styling
    fig = go.Figure()
    dates = [(datetime.now() - timedelta(days=i)).strftime("%b %d") for i in range(7, 0, -1)]
    scores = [max(0, min(100, health_score + (i * 2))) for i in range(-3, 4)]
    
    fig.add_trace(go.Scatter(
        x=dates, 
        y=scores, 
        mode='lines+markers',
        name='Health Score',
        line=dict(color='#00d4ff', width=3),
        marker=dict(size=10, color='#00d4ff', line=dict(color='white', width=2)),
        fill='tozeroy',
        fillcolor='rgba(0, 212, 255, 0.1)'
    ))
    
    fig.update_layout(
        title="📈 7-Day Health Trend",
        xaxis_title="Date",
        yaxis_title="Score",
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e0e0e0'),
        hovermode='x unified',
        yaxis=dict(range=[0, 100], gridcolor='rgba(255,255,255,0.1)'),
        xaxis=dict(gridcolor='rgba(255,255,255,0.1)')
    )
    st.plotly_chart(fig, use_container_width=True)

with tab2:
    st.markdown("### 💪 Fitness & Activity Plan")
    
    col1, col2 = st.columns(2)
    with col1:
        st.metric("👟 Daily Steps", f"{daily_steps:,}")
        steps_progress = min(daily_steps / 10000, 1.0)
        st.progress(steps_progress)
        st.caption(f"Target: 10,000 steps ({steps_progress*100:.0f}% complete)")
    with col2:
        st.metric("⏱️ Exercise Minutes", f"{exercise_minutes} min")
        exercise_progress = min(exercise_minutes / 60, 1.0)
        st.progress(exercise_progress)
        st.caption(f"Target: 60 minutes ({exercise_progress*100:.0f}% complete)")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Activity breakdown
    st.markdown("#### 📊 Activity Breakdown")
    activity_data = {
        'Activity': ['Steps', 'Exercise', 'Rest'],
        'Minutes': [daily_steps / 100, exercise_minutes, max(0, 1440 - (daily_steps / 100) - exercise_minutes)]
    }
    
    fig = go.Figure(data=[go.Pie(
        labels=activity_data['Activity'],
        values=activity_data['Minutes'],
        hole=.4,
        marker=dict(colors=['#00d4ff', '#0096c7', '#2d2d44'])
    )])
    
    fig.update_layout(
        title="Daily Activity Distribution",
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e0e0e0')
    )
    st.plotly_chart(fig, use_container_width=True)

with tab3:
    st.markdown("### 💰 Financial Sync Report")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("🏠 Home-cooked Meals", f"{home_cooked}/week")
    with col2:
        st.metric("🍕 Takeout Meals", f"{takeout_meals}/week")
    with col3:
        st.metric("🛒 Grocery Spend", f"${grocery_spend:.2f}")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Meal distribution with modern styling
    total_meals = home_cooked + takeout_meals
    home_pct = (home_cooked / total_meals * 100) if total_meals > 0 else 0
    
    fig = go.Figure(data=[go.Pie(
        labels=['🏠 Home-cooked', '🍕 Takeout'], 
        values=[home_cooked, takeout_meals],
        hole=.4,
        marker=dict(colors=['#10b981', '#ef4444']),
        textinfo='label+percent',
        textfont=dict(size=14, color='white')
    )])
    
    fig.update_layout(
        title=f"Weekly Meal Distribution ({home_pct:.0f}% Home-cooked)",
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e0e0e0')
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # Financial insights
    if home_pct >= 70:
        st.success("✅ Excellent! You're cooking at home most of the time.")
    elif home_pct >= 50:
        st.info("💡 Good progress! Try to increase home-cooked meals.")
    else:
        st.warning("⚠️ Consider cooking more at home to save money and eat healthier.")

with tab4:
    st.markdown("### 📚 Personal Development")
    
    completion_rate = (study_blocks / study_planned * 100) if study_planned > 0 else 0
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("✅ Completed", f"{study_blocks}")
    with col2:
        st.metric("📋 Planned", f"{study_planned}")
    with col3:
        st.metric("📊 Completion Rate", f"{completion_rate:.1f}%")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Progress visualization
    progress = min(study_blocks / study_planned, 1.0)
    st.progress(progress)
    st.caption(f"{study_blocks} of {study_planned} study blocks completed")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Study progress chart
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        x=['Completed', 'Remaining'],
        y=[study_blocks, max(0, study_planned - study_blocks)],
        marker=dict(color=['#00d4ff', '#2d2d44']),
        text=[study_blocks, max(0, study_planned - study_blocks)],
        textposition='auto',
    ))
    
    fig.update_layout(
        title="Study Progress Overview",
        yaxis_title="Study Blocks",
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#e0e0e0'),
        yaxis=dict(gridcolor='rgba(255,255,255,0.1)'),
        showlegend=False
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # Motivational message
    if completion_rate >= 80:
        st.success("🌟 Outstanding! You're crushing your study goals!")
    elif completion_rate >= 60:
        st.info("💪 Great work! Keep up the momentum!")
    elif completion_rate >= 40:
        st.warning("📈 You're making progress. Stay focused!")
    else:
        st.error("⚡ Time to catch up! You can do this!")

# Footer
st.markdown("<br><br>", unsafe_allow_html=True)
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 20px; color: #a0a0c0;">
    <p style="font-size: 14px; margin-bottom: 10px;">
        <strong>Kiro Fitfin AI</strong> - Your discipline-focused mentor for health, fitness, finance, and growth
    </p>
    <p style="font-size: 12px; color: #6b7280;">
        💡 Track daily • 📊 Analyze trends • 🎯 Achieve goals
    </p>
</div>
""", unsafe_allow_html=True)
