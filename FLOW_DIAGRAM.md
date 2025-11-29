# 🎯 Kiro Fitfin AI - Flow Diagram

## System Architecture Flow

```mermaid
graph TD
    A[User Opens App] --> B{First Time User?}
    B -->|Yes| C[Show Welcome Guide]
    B -->|No| D[Show Dashboard]
    C --> D
    
    D --> E[Sidebar Input Panel]
    E --> F{Quick Start?}
    F -->|Average Day| G[Load Average Presets]
    F -->|Active Day| H[Load Active Presets]
    F -->|Manual| I[User Inputs Data]
    
    G --> J[Calculate Scores]
    H --> J
    I --> J
    
    J --> K[Health Score Calculation]
    J --> L[Fitness Score Calculation]
    J --> M[Finance Score Calculation]
    J --> N[Growth Score Calculation]
    
    K --> O[Overall LifeFitFinSync Score]
    L --> O
    M --> O
    N --> O
    
    O --> P{Check Thresholds}
    P -->|Critical| Q[Show Emergency Alert]
    P -->|Normal| R[Display Score Cards]
    
    Q --> R
    R --> S[Interactive Dashboard]
    
    S --> T[Health Tab]
    S --> U[Fitness Tab]
    S --> V[Finance Tab]
    S --> W[Growth Tab]
    
    T --> X[7-Day Health Trend Chart]
    U --> Y[Activity Breakdown Chart]
    V --> Z[Meal Distribution Chart]
    W --> AA[Study Progress Chart]
    
    X --> AB[User Reviews Data]
    Y --> AB
    Z --> AB
    AA --> AB
    
    AB --> AC{Update Metrics?}
    AC -->|Yes| E
    AC -->|No| AD[Continue Monitoring]
```

## Data Flow Diagram

```mermaid
flowchart LR
    A[User Input] --> B[Data Validation]
    B --> C[Score Calculation Engine]
    
    C --> D[Health Module]
    C --> E[Fitness Module]
    C --> F[Finance Module]
    C --> G[Growth Module]
    
    D --> H[Diet Quality Score]
    D --> I[Hydration Score]
    D --> J[Sleep Score]
    
    E --> K[Steps Score]
    E --> L[Exercise Score]
    
    F --> M[Home Cooking Ratio]
    F --> N[Spending Analysis]
    
    G --> O[Study Completion Rate]
    
    H --> P[Weighted Average]
    I --> P
    J --> P
    K --> P
    L --> P
    M --> P
    N --> P
    O --> P
    
    P --> Q[Overall Score]
    Q --> R[Visual Display]
    R --> S[Charts & Graphs]
    R --> T[Score Badges]
    R --> U[Progress Bars]
```

## User Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Sidebar
    participant C as Calculator
    participant D as Dashboard
    participant V as Visualizations
    
    U->>S: Open App
    S->>U: Show Input Panel
    
    alt Quick Start
        U->>S: Click Preset Button
        S->>C: Load Preset Values
    else Manual Input
        U->>S: Enter Metrics
        S->>C: Send Input Data
    end
    
    C->>C: Validate Data
    C->>C: Calculate Health Score
    C->>C: Calculate Fitness Score
    C->>C: Calculate Finance Score
    C->>C: Calculate Growth Score
    C->>C: Calculate Overall Score
    
    C->>D: Send All Scores
    D->>U: Display Score Cards
    
    alt Critical Threshold
        D->>U: Show Emergency Alert
    end
    
    U->>D: Select Tab
    D->>V: Request Chart Data
    V->>D: Render Chart
    D->>U: Display Visualization
    
    U->>S: Update Metrics
    S->>C: Recalculate
    C->>D: Update Display
```

## Score Calculation Flow

```mermaid
graph TD
    A[Input Data] --> B{Health Metrics}
    A --> C{Fitness Metrics}
    A --> D{Finance Metrics}
    A --> E{Growth Metrics}
    
    B --> B1[Calories: 0-5000]
    B --> B2[Hydration: 0-5L]
    B --> B3[Sleep: 0-12hrs]
    B --> B4[Diet Quality: 0-100]
    
    B1 --> F[Health Score Algorithm]
    B2 --> F
    B3 --> F
    B4 --> F
    
    C --> C1[Steps: 0-50000]
    C --> C2[Exercise: 0-300min]
    
    C1 --> G[Fitness Score Algorithm]
    C2 --> G
    
    D --> D1[Home Meals: 0-21]
    D --> D2[Takeout: 0-21]
    D --> D3[Grocery: $0+]
    
    D1 --> H[Finance Score Algorithm]
    D2 --> H
    D3 --> H
    
    E --> E1[Completed: 0-50]
    E --> E2[Planned: 1-50]
    
    E1 --> I[Growth Score Algorithm]
    E2 --> I
    
    F --> J[Score: 0-100]
    G --> K[Score: 0-100]
    H --> L[Score: 0-100]
    I --> M[Score: 0-100]
    
    J --> N[Weighted Average]
    K --> N
    L --> N
    M --> N
    
    N --> O[Overall LifeFitFinSync Score]
    O --> P{Score Range}
    
    P -->|80-100| Q[Excellent Badge]
    P -->|60-79| R[Good Badge]
    P -->|40-59| S[Fair Badge]
    P -->|0-39| T[Poor Badge]
```

## Component Architecture

```mermaid
graph TB
    A[Streamlit App] --> B[UI Layer]
    A --> C[Business Logic]
    A --> D[Data Layer]
    
    B --> B1[Sidebar Component]
    B --> B2[Dashboard Component]
    B --> B3[Chart Components]
    B --> B4[Alert Component]
    
    B1 --> B1A[Quick Start Buttons]
    B1 --> B1B[Input Fields]
    B1 --> B1C[Tooltips]
    
    B2 --> B2A[Score Cards]
    B2 --> B2B[Score Badges]
    B2 --> B2C[Tab Navigation]
    
    B3 --> B3A[Health Trend Chart]
    B3 --> B3B[Activity Pie Chart]
    B3 --> B3C[Meal Distribution]
    B3 --> B3D[Progress Bars]
    
    C --> C1[Score Calculator]
    C --> C2[Threshold Checker]
    C --> C3[Data Validator]
    
    C1 --> C1A[Health Algorithm]
    C1 --> C1B[Fitness Algorithm]
    C1 --> C1C[Finance Algorithm]
    C1 --> C1D[Growth Algorithm]
    
    D --> D1[Session State]
    D --> D2[Preset Data]
    D --> D3[Chart Data]
```

## Deployment Flow

```mermaid
graph LR
    A[Local Development] --> B[Git Commit]
    B --> C[Push to GitHub]
    C --> D{Deploy Target}
    
    D -->|Streamlit Cloud| E[Streamlit Build]
    D -->|Local| F[streamlit run app.py]
    
    E --> G[Install Dependencies]
    G --> H[Build App]
    H --> I[Deploy to Cloud]
    I --> J[Live URL]
    
    F --> K[Local Server]
    K --> L[localhost:8501]
    
    J --> M[Users Access App]
    L --> M
```

## Feature Interaction Map

```mermaid
mindmap
  root((Kiro Fitfin AI))
    Input Methods
      Quick Start Presets
        Average Day
        Active Day
      Manual Input
        Sliders
        Number Inputs
      Reset Button
    
    Score System
      Health Score
        Calories
        Hydration
        Sleep
        Diet Quality
      Fitness Score
        Daily Steps
        Exercise Minutes
      Finance Score
        Home Meals
        Takeout Meals
        Spending
      Growth Score
        Study Blocks
        Completion Rate
      Overall Score
        Weighted Average
        Score Badge
    
    Visualizations
      Health Tab
        Trend Chart
        Metrics Cards
      Fitness Tab
        Activity Pie
        Progress Bars
      Finance Tab
        Meal Distribution
        Insights
      Growth Tab
        Progress Bar
        Completion Chart
    
    Alerts
      Emergency Banner
      Threshold Warnings
      Doctor Contact
      Action Items
```

