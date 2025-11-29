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

# Custom CSS for dark mode styling
st.markdown("""
<style>
    .main {
        background-color: #1a1a1a;
        color: #e0e0e0;
    }
    .stMetric {
        background-color: #2d2d2d;
        padding: 15px;
        border-radius: 8px;
    }
    .emergency-alert {
        background-color: #dc2626;
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'dark_mode' not in st.session_state:
    st.session_state.dark_mode = True

# Header
col1, col2 = st.columns([6, 1])
with col1:
    st.title("🎯 Kiro Fitfin AI")
    st.markdown("*Your unified health, fitness, finance, and personal growth mentor*")

# Sidebar for data input
with st.sidebar:
    st.header("📊 Data Input")
    
    # Health Metrics
    st.subheader("Health & Diet")
    calories = st.number_input("Daily Calories", min_value=0, max_value=5000, value=2000)
    hydration = st.slider("Hydration (Liters)", 0.0, 5.0, 2.0, 0.1)
    sleep_hours = st.slider("Sleep Hours", 0.0, 12.0, 7.0, 0.5)
    diet_quality = st.slider("Diet Quality Score", 0, 100, 75)
    
    # Fitness Metrics
    st.subheader("Fitness & Activity")
    daily_steps = st.number_input("Daily Steps", min_value=0, max_value=50000, value=8000)
    exercise_minutes = st.number_input("Exercise Minutes", min_value=0, max_value=300, value=30)
    
    # Finance Metrics
    st.subheader("Financial Sync")
    home_cooked = st.number_input("Home-cooked Meals (week)", min_value=0, max_value=21, value=15)
    takeout_meals = st.number_input("Takeout Meals (week)", min_value=0, max_value=21, value=6)
    grocery_spend = st.number_input("Grocery Spend ($)", min_value=0.0, value=150.0)
    
    # Growth Metrics
    st.subheader("Personal Development")
    study_blocks = st.number_input("Study Blocks Completed", min_value=0, max_value=50, value=10)
    study_planned = st.number_input("Study Blocks Planned", min_value=1, max_value=50, value=15)

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

# Emergency Alert (if any metric is critical)
show_alert = hydration < 1.0 or sleep_hours < 5.0
if show_alert:
    st.markdown("""
    <div class="emergency-alert">
        <h3>⚠️ EMERGENCY ALERT</h3>
        <p>Critical health threshold detected. Please consult your doctor immediately.</p>
        <p><strong>Dr. Sarah Johnson</strong><br>
        📞 +1 (555) 123-4567<br>
        📧 dr.johnson@healthclinic.com</p>
    </div>
    """, unsafe_allow_html=True)

# Main Dashboard
st.header("📈 LifeFitFinSync Score")

# Score cards
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("Overall Score", f"{overall_score:.1f}", delta=None)
with col2:
    st.metric("Health", f"{health_score:.1f}", delta=None)
with col3:
    st.metric("Fitness", f"{fitness_score:.1f}", delta=None)
with col4:
    st.metric("Finance", f"{finance_score:.1f}", delta=None)
with col5:
    st.metric("Growth", f"{growth_score:.1f}", delta=None)

# Detailed sections
tab1, tab2, tab3, tab4 = st.tabs(["🥗 Health", "💪 Fitness", "💰 Finance", "📚 Growth"])

with tab1:
    st.subheader("Diet & Health Insights")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Daily Calories", f"{calories} kcal")
        st.metric("Hydration", f"{hydration} L")
    with col2:
        st.metric("Sleep Hours", f"{sleep_hours} hrs")
        st.metric("Diet Quality", f"{diet_quality}/100")
    
    # Health trend chart
    fig = go.Figure()
    dates = [(datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7, 0, -1)]
    scores = [health_score + (i * 2) for i in range(-3, 4)]
    fig.add_trace(go.Scatter(x=dates, y=scores, mode='lines+markers', name='Health Score'))
    fig.update_layout(title="7-Day Health Trend", xaxis_title="Date", yaxis_title="Score")
    st.plotly_chart(fig, use_container_width=True)

with tab2:
    st.subheader("Fitness & Activity Plan")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Daily Steps", f"{daily_steps:,}")
        st.progress(min(daily_steps / 10000, 1.0))
    with col2:
        st.metric("Exercise Minutes", f"{exercise_minutes} min")
        st.progress(min(exercise_minutes / 60, 1.0))

with tab3:
    st.subheader("Financial Sync Report")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Home-cooked Meals", f"{home_cooked}/week")
    with col2:
        st.metric("Takeout Meals", f"{takeout_meals}/week")
    with col3:
        st.metric("Grocery Spend", f"${grocery_spend:.2f}")
    
    # Meal distribution pie chart
    fig = go.Figure(data=[go.Pie(labels=['Home-cooked', 'Takeout'], 
                                  values=[home_cooked, takeout_meals])])
    fig.update_layout(title="Weekly Meal Distribution")
    st.plotly_chart(fig, use_container_width=True)

with tab4:
    st.subheader("Personal Development")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Study Blocks Completed", f"{study_blocks}/{study_planned}")
        st.progress(min(study_blocks / study_planned, 1.0))
    with col2:
        completion_rate = (study_blocks / study_planned * 100) if study_planned > 0 else 0
        st.metric("Completion Rate", f"{completion_rate:.1f}%")

# Footer
st.markdown("---")
st.markdown("*Kiro Fitfin AI - Your discipline-focused mentor for health, fitness, finance, and growth*")
