import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  ArrowRightLeft, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Activity,
  AlertCircle,
  Globe,
  Brain, 
  X,
  CheckCircle2,
  Loader2,
  Lock, 
  Crown,
  Plus,
  Trash2, 
  Filter,
  Copy,
  User,
  Mail,
  Shield,
  LogOut,
  Moon,
  Sun,
  Edit3,
  Briefcase,
  Minus,
  BarChart2,
  RefreshCw,
  Wifi,
  WifiOff,
  CloudLightning, // Yahoo
  Zap // Alpha Vantage
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- CONFIGURATION ---
// PASTE YOUR KEYS HERE
const ALPHA_VANTAGE_API_KEY = "MM4DAC36S2M5Z8XC"; 
const TWELVE_DATA_API_KEY = "2b701a7213fd48f59edf447a987c2f78"; 

// --- TOGGLE CSS ---
const toggleStyles = `
.toggleWrapper { position: relative; display: inline-block; overflow: hidden; padding: 0; transform: scale(0.6); transform-origin: center; margin-right: -10px; }
.toggleWrapper .input { position: absolute; left: -99em; }
.toggle { cursor: pointer; display: inline-block; position: relative; width: 90px; height: 50px; background-color: #83d8ff; border-radius: 84px; transition: background-color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95); }
.toggle:before, .toggle:after { position: absolute; top: 15px; font-size: 18px; opacity: 0; }
.toggle__handler { display: inline-block; position: relative; z-index: 1; top: 3px; left: 3px; width: 44px; height: 44px; background-color: #ffcf96; border-radius: 50px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55); transform: rotate(-45deg); }
.toggle__handler .crater { position: absolute; background-color: #e8cda5; opacity: 0; transition: opacity 200ms ease-in-out; border-radius: 100%; }
.toggle__handler .crater--1 { top: 18px; left: 10px; width: 4px; height: 4px; }
.toggle__handler .crater--2 { top: 28px; left: 22px; width: 6px; height: 6px; }
.toggle__handler .crater--3 { top: 10px; left: 25px; width: 8px; height: 8px; }
.star { position: absolute; background-color: #fff; transition: all 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95); border-radius: 50%; }
.star--1 { top: 10px; left: 35px; z-index: 0; width: 30px; height: 3px; }
.star--2 { top: 18px; left: 28px; z-index: 1; width: 30px; height: 3px; }
.star--3 { top: 27px; left: 40px; z-index: 0; width: 30px; height: 3px; }
.star--4, .star--5, .star--6 { opacity: 0; transition: all 300ms 0 cubic-bezier(0.445, 0.05, 0.55, 0.95); }
.star--4 { top: 16px; left: 11px; z-index: 0; width: 2px; height: 2px; transform: translate3d(3px, 0, 0); }
.star--5 { top: 32px; left: 17px; z-index: 0; width: 3px; height: 3px; transform: translate3d(3px, 0, 0); }
.star--6 { top: 36px; left: 28px; z-index: 0; width: 2px; height: 2px; transform: translate3d(3px, 0, 0); }
.input:checked + .toggle { background-color: #749dd6; }
.input:checked + .toggle .toggle__handler { background-color: #ffe5b5; transform: translate3d(40px, 0, 0) rotate(0); }
.input:checked + .toggle .toggle__handler .crater { opacity: 1; }
.input:checked + .toggle .star--1 { width: 2px; height: 2px; }
.input:checked + .toggle .star--2 { width: 4px; height: 4px; transform: translate3d(-5px, 0, 0); }
.input:checked + .toggle .star--3 { width: 2px; height: 2px; transform: translate3d(-7px, 0, 0); }
.input:checked + .toggle .star--4, .input:checked + .toggle .star--5, .input:checked + .toggle .star--6 { opacity: 1; transform: translate3d(0, 0, 0); }
`;

// Colors for Pie Chart
const PIE_COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// Categories List
const CATEGORIES = ["Entertainment", "Food & Dining", "Shopping", "Transport", "Bills & Utilities", "Salary", "Investment", "Freelance", "Other"];

// Card Gradients
const CARD_GRADIENTS = ['from-violet-600 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-orange-500 to-rose-500', 'from-blue-500 to-cyan-500', 'from-slate-700 to-slate-900'];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- STATE WITH PERSISTENCE ---
  const [isDarkMode, setIsDarkMode] = useState(() => { try { return JSON.parse(localStorage.getItem('finova_darkMode')) || false; } catch { return false; } });
  const [userPlan, setUserPlan] = useState(() => { try { return localStorage.getItem('finova_userPlan') || 'free'; } catch { return 'free'; } });
  const [userProfile, setUserProfile] = useState(() => { try { const saved = localStorage.getItem('finova_profile'); return saved ? JSON.parse(saved) : { name: 'John Doe', email: 'john@finova.com' }; } catch { return { name: 'John Doe', email: 'john@finova.com' }; } });
  
  // --- NOTIFICATIONS STATE ---
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, title: 'Stock Alert', message: 'Reliance hit 52-week high!', time: '2h ago', type: 'positive' },
    { id: 2, title: 'High Spending', message: 'Entertainment budget exceeded.', time: '5h ago', type: 'negative' },
    { id: 3, title: 'Bill Due', message: 'Credit card bill due in 3 days.', time: '1d ago', type: 'neutral' }
  ];

  const [transactions, setTransactions] = useState(() => {
    try { 
      const saved = localStorage.getItem('finova_transactions'); 
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.error(e); }
    return [
      { id: 1, name: "Netflix Subscription", date: "2023-10-24", amount: 649.00, type: "debit", category: "Entertainment" },
      { id: 2, name: "Freelance Payment", date: "2023-10-23", amount: 15000.00, type: "credit", category: "Freelance" },
      { id: 3, name: "Grocery Store", date: "2023-10-24", amount: 2500.00, type: "debit", category: "Food & Dining" },
      { id: 4, name: "Spotify Music", date: "2023-10-22", amount: 119.00, type: "debit", category: "Entertainment" },
      { id: 5, name: "Salary Deposit", date: "2023-10-20", amount: 85000.00, type: "credit", category: "Salary" }
    ];
  });

  const [budgets, setBudgets] = useState(() => {
    try { const saved = localStorage.getItem('finova_budgets'); return saved ? JSON.parse(saved) : { "Entertainment": 2000, "Food & Dining": 5000, "Shopping": 5000, "Transport": 3000, "Bills & Utilities": 10000, "Other": 1000 }; } catch { return {}; }
  });

  const [cards, setCards] = useState(() => {
    try { const saved = localStorage.getItem('finova_cards'); if (saved) return JSON.parse(saved); } catch (e) {}
    return [
      { id: 1, bank: 'HDFC Bank', number: '4532 **** **** 8896', holder: 'JOHN DOE', expiry: '12/28', type: 'Visa', gradient: 'from-violet-600 to-indigo-600' },
      { id: 2, bank: 'SBI Card', number: '5412 **** **** 1023', holder: 'JOHN DOE', expiry: '09/25', type: 'Mastercard', gradient: 'from-emerald-500 to-teal-600' }
    ];
  });

  const [portfolio, setPortfolio] = useState(() => {
    try { const saved = localStorage.getItem('finova_portfolio'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  // --- SAVE TO LOCALSTORAGE ---
  useEffect(() => { localStorage.setItem('finova_darkMode', JSON.stringify(isDarkMode)); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('finova_userPlan', userPlan); }, [userPlan]);
  useEffect(() => { localStorage.setItem('finova_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('finova_cards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { localStorage.setItem('finova_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('finova_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('finova_portfolio', JSON.stringify(portfolio)); }, [portfolio]);

  // Stock Data States
  const [stockData, setStockData] = useState([]); // Default empty, load on search
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataSource, setDataSource] = useState(''); 
  
  // Rate Limit Handling
  const [canRefresh, setCanRefresh] = useState(true);
  const dataFetchedRef = useRef(false);

  // AI Analysis States
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [analyzingStock, setAnalyzingStock] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Modal States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ name: '', amount: '', type: 'debit', category: 'Other' });
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({ bank: '', number: '', expiry: '', type: 'Visa', gradient: CARD_GRADIENTS[0] });

  // Buy/Sell Stock State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false); 
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeQuantity, setTradeQuantity] = useState(1);

  // --- CHARTING STATES ---
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartStock, setChartStock] = useState(null);
  const [chartHistory, setChartHistory] = useState([]);
  const [chartRange, setChartRange] = useState('1mo');
  const [chartLoading, setChartLoading] = useState(false);

  // Budget Editing
  const [editingBudgetCategory, setEditingBudgetCategory] = useState(null);
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // --- THEME ---
  const theme = {
    appBg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
    textMain: isDarkMode ? 'text-white' : 'text-slate-900',
    textSub: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    cardBg: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    headerBg: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    inputBg: isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500',
    hoverBg: isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
    gridColor: isDarkMode ? '#334155' : '#e2e8f0',
    tooltipBg: isDarkMode ? '#1e293b' : '#ffffff',
    modalBg: isDarkMode ? 'bg-slate-900' : 'bg-white',
  };

  // --- FINANCIAL CALCULATIONS ---
  const financials = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'credit') income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const portfolioValue = useMemo(() => {
    return portfolio.reduce((acc, stock) => {
      const liveStock = stockData.find(s => s.symbol === stock.symbol);
      const price = liveStock && liveStock.current_price > 0 ? liveStock.current_price : stock.avgPrice;
      return acc + (price * stock.quantity);
    }, 0);
  }, [portfolio, stockData]);

  const expenseBreakdown = useMemo(() => {
    const categories = {};
    transactions.filter(t => t.type === 'debit').forEach(t => {
      const cat = t.category || "Other";
      categories[cat] = (categories[cat] || 0) + t.amount;
    });
    return Object.keys(categories).map(name => ({ name, value: categories[name] }));
  }, [transactions]);

  const budgetProgress = useMemo(() => {
    return expenseBreakdown.map(item => {
      const limit = budgets[item.name] || 0;
      return {
        category: item.name,
        spent: item.value,
        limit: limit,
        percentage: limit > 0 ? (item.value / limit) * 100 : 0
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [expenseBreakdown, budgets]);

  const chartData = useMemo(() => {
    const data = [{ name: 'Mon'}, { name: 'Tue'}, { name: 'Wed'}, { name: 'Thu'}, { name: 'Fri'}, { name: 'Sat'}, { name: 'Sun'}];
    return data.map(d => ({
      name: d.name,
      income: Math.floor(Math.random() * (financials.income / 2)) + (financials.income / 10),
      expense: Math.floor(Math.random() * (financials.expense / 2)) + (financials.expense / 10)
    }));
  }, [financials]);


  // ---------------------------------------------
  // --- MULTI-TIER DATA FETCHING STRATEGY ---
  // ---------------------------------------------

  const fetchAlphaVantage = async (symbol) => {
    if (!ALPHA_VANTAGE_API_KEY) throw new Error("No AV Key");
    const response = await fetch(`/api/alpha/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    
    if (data.Note || data.Information) throw new Error("AV Limit");
    
    const quote = data['Global Quote'];
    if (!quote || !quote['01. symbol']) throw new Error("AV No Data");

    return {
      id: quote['01. symbol'],
      symbol: quote['01. symbol'],
      name: quote['01. symbol'], // AV Quote lacks name, use symbol
      current_price: parseFloat(quote['05. price']),
      percent_change: parseFloat(quote['10. change percent'].replace('%', '')),
      currency: symbol.includes('.') ? 'INR' : 'USD', 
      exchange: symbol.includes('BSE') || symbol.includes('NS') ? 'India' : 'US',
      source: 'Alpha Vantage (Primary)'
    };
  };

  const fetchTwelveData = async (symbol) => {
    if (symbol.includes('.NS') || symbol.includes('.BO')) throw new Error("Twelve Data Free Tier doesn't support India");
    if (!TWELVE_DATA_API_KEY) throw new Error("No TD Key");
    
    const response = await fetch(`/api/twelve/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`);
    const json = await response.json();

    if (json.code && json.code !== 200) throw new Error(json.message);
    if (!json.symbol) throw new Error("TD No Data");

    return {
      id: json.symbol,
      symbol: json.symbol, 
      name: json.name,
      current_price: parseFloat(json.close) || parseFloat(json.open) || 0,
      percent_change: parseFloat(json.percent_change) || 0,
      currency: json.currency,
      exchange: json.exchange,
      source: 'Twelve Data (US Fallback)'
    };
  };

  const fetchYahooFinance = async (symbol) => {
    // CORRECT SYMBOL MAPPING FOR YAHOO
    let yahooSymbol = symbol;
    // Yahoo uses .BO for BSE (Alpha Vantage uses .BSE)
    if (yahooSymbol.includes('.BSE')) {
        yahooSymbol = yahooSymbol.replace('.BSE', '.BO');
    }

    const response = await fetch(`/api/yahoo/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d&t=${Date.now()}`);
    if (!response.ok) throw new Error("Yahoo API Error");
    
    const json = await response.json();
    const result = json.chart?.result?.[0];
    if (!result) throw new Error("Yahoo No Data");

    const meta = result.meta;
    const quote = result.indicators.quote[0];
    const price = meta.regularMarketPrice || (quote.close && quote.close[quote.close.length - 1]) || 0;
    
    const prevClose = meta.chartPreviousClose || meta.previousClose || price;
    const changePct = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

    return {
      id: meta.symbol,
      symbol: meta.symbol,
      name: meta.shortName || meta.symbol,
      current_price: price,
      percent_change: changePct,
      currency: meta.currency,
      exchange: meta.exchangeName,
      source: 'Yahoo Finance (Delayed/Backup)'
    };
  };

  // --- SMART SEARCH SYMBOL RESOLVER ---
  // Tries to find the correct symbol for a name (e.g. "Reliance" -> "RELIANCE.BSE")
  const findSymbol = async (query) => {
    // 1. Try Alpha Vantage Search (Best for Indian Stocks on free tier)
    if (ALPHA_VANTAGE_API_KEY) {
      try {
        const response = await fetch(`/api/alpha/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`);
        const data = await response.json();
        if (data.bestMatches && data.bestMatches.length > 0) {
          return data.bestMatches[0]['1. symbol'];
        }
      } catch (e) {
        console.warn("AV Search failed/skipped", e);
      }
    }

    // 2. Try Yahoo Finance Search (Robust Backup for Names)
    try {
      const response = await fetch(`/api/yahoo/v1/finance/search?q=${query}&quotesCount=1`);
      const data = await response.json();
      if (data.quotes && data.quotes.length > 0) {
        let sym = data.quotes[0].symbol;
        // Convert Yahoo's .BO to .BSE for consistency if needed, but our fetchYahooFinance handles mapping.
        // Let's return as is, and let the fetchers handle it.
        return sym;
      }
    } catch (e) {
      console.warn("Yahoo Search failed", e);
    }
    
    // 3. Fallback: Return query as is (assume user typed symbol)
    return query.toUpperCase();
  };

  // --- MASTER SEARCH HANDLER ---
  const handleSearch = async () => {
    if (!searchQuery.trim()) { 
       setStockData([]); // Clear on empty
       setDataSource('');
       return; 
    }
    setLoading(true);
    setError(null);
    setStockData([]); // Clear previous

    try {
      // Step A: Find the correct Symbol
      const resolvedSymbol = await findSymbol(searchQuery);
      if (!resolvedSymbol) throw new Error("Symbol not found");

      // Step B: Fetch Data with Fallback Strategy
      
      // 1. Try Primary (Alpha Vantage)
      try {
        const avData = await fetchAlphaVantage(resolvedSymbol);
        setStockData([avData]);
        setDataSource(avData.source);
        setLastUpdated(new Date());
        setLoading(false);
        return;
      } catch (e) {
        console.warn("Alpha Vantage skipped/failed:", e.message);
      }

      // 2. Try Twelve Data (Only if likely US stock or if AV failed)
      try {
        const tdData = await fetchTwelveData(resolvedSymbol);
        setStockData([tdData]);
        setDataSource(tdData.source);
        setLastUpdated(new Date());
        setLoading(false);
        return;
      } catch (e) {
        console.warn("Twelve Data skipped/failed:", e.message);
      }

      // 3. Try Yahoo Finance (Last Resort)
      try {
        const yahooData = await fetchYahooFinance(resolvedSymbol);
        setStockData([yahooData]);
        setDataSource(yahooData.source);
        setLastUpdated(new Date());
        setLoading(false);
        return;
      } catch (e) {
        console.warn("Yahoo failed:", e.message);
      }

      throw new Error("All data sources failed or limited.");

    } catch (err) {
      console.error(err);
      setError(`Could not fetch data. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (stock) => {
    setAnalyzingStock(stock);
    setAnalysisModalOpen(true);
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/ai-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          symbol: stock.symbol,
          prediction_days: 7,
          analysis_mode: "deep",
          user_position: "dont_own"
        }),
      });

      if (!response.ok) {
         const errText = await response.text();
         throw new Error(`Analysis Failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      const oneDayPred = data.predictions?.['1_day'] || {};
      const sevenDayPred = data.predictions?.['7_day'] || {};
      const sentiment = sevenDayPred.change_percent > 0 ? "Bullish" : (sevenDayPred.change_percent < 0 ? "Bearish" : "Neutral");
      
      const mappedResult = {
        recommendation: sentiment, 
        confidence_score: (data.confidence || 0) / 100, 
        forecast_value: oneDayPred.predicted_price?.toFixed(2),
        current_price: data.current_price?.toFixed(2),
        summary: data.reasoning?.technical_factors?.slice(0, 3).join(". ") || "Analysis completed successfully."
      };
      
      setAnalysisResult({ ...data, ...mappedResult }); 

    } catch (err) {
      console.error("AI Analysis Error:", err);
      // Fallback Demo Data
      setTimeout(() => {
        setAnalysisResult({
          recommendation: "Bullish (Demo)",
          confidence_score: 0.85,
          forecast_value: (stock.current_price * 1.01).toFixed(2),
          current_price: stock.current_price,
          predictions: {
            '1_day': { predicted_price: stock.current_price * 1.01, change_percent: 1.0 },
            '7_day': { predicted_price: stock.current_price * 1.05, change_percent: 5.0 },
            '30_day': { predicted_price: stock.current_price * 1.10, change_percent: 10.0 }
          },
          reasoning: { technical_factors: ['Price above 50-day moving average'], fundamental_factors: ['Strong quarterly earnings expected'], pattern_factors: ['Bullish flag pattern detected'] },
          risk_management: { stop_loss: stock.current_price * 0.95, take_profit: stock.current_price * 1.15, risk_reward_ratio: 3.0 },
          technical_analysis: { chart_sentiment: 'Bullish' },
          summary: `AI model predicts a bullish trend for ${stock.symbol}. Recommend entry at current levels.`
        });
        setAnalysisError(null);
      }, 1500);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount) return;
    const transaction = {
      id: Date.now(),
      name: newTransaction.name,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions([transaction, ...transactions]);
    setNewTransaction({ name: '', amount: '', type: 'debit', category: 'Other' });
    setIsTransactionModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddCard = () => {
    if (!newCard.number) return;
    const card = {
      id: Date.now(),
      bank: newCard.bank || 'New Bank',
      number: newCard.number,
      holder: userProfile.name.toUpperCase(),
      expiry: newCard.expiry || '12/99',
      type: newCard.type,
      gradient: newCard.gradient
    };
    setCards([...cards, card]);
    setNewCard({ bank: '', number: '', expiry: '', type: 'Visa', gradient: CARD_GRADIENTS[0] });
    setIsCardModalOpen(false);
  };

  const handleDeleteCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleResetApp = () => {
    if (confirm("Reset all data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const updateBudget = (category) => {
    if (!newBudgetLimit) return;
    setBudgets({ ...budgets, [category]: parseFloat(newBudgetLimit) });
    setEditingBudgetCategory(null);
    setNewBudgetLimit('');
  };

  const openBuyModal = (stock) => { setSelectedStock(stock); setTradeQuantity(1); setIsBuyModalOpen(true); };
  const openSellModal = (stock) => {
    const holding = portfolio.find(p => p.symbol === stock.symbol);
    if (holding) { setSelectedStock({ ...stock, current_price: stock.avgPrice, name: stock.name }); setTradeQuantity(1); setIsSellModalOpen(true); }
  };

  const executeBuy = () => {
    if (!selectedStock) return;
    const cost = selectedStock.current_price * tradeQuantity;
    const transaction = { id: Date.now(), name: `Buy ${selectedStock.symbol} (${tradeQuantity} qty)`, amount: cost, type: 'debit', category: 'Investment', date: new Date().toISOString().split('T')[0] };
    setTransactions([transaction, ...transactions]);
    const existingHolding = portfolio.find(p => p.symbol === selectedStock.symbol);
    let newPortfolio;
    if (existingHolding) {
      newPortfolio = portfolio.map(p => p.symbol === selectedStock.symbol ? { ...p, quantity: p.quantity + parseFloat(tradeQuantity), avgPrice: (p.avgPrice * p.quantity + cost) / (p.quantity + parseFloat(tradeQuantity)) } : p);
    } else {
      newPortfolio = [...portfolio, { symbol: selectedStock.symbol, name: selectedStock.name, quantity: parseFloat(tradeQuantity), avgPrice: selectedStock.current_price, currency: selectedStock.currency }];
    }
    setPortfolio(newPortfolio);
    setIsBuyModalOpen(false);
  };

  const executeSell = () => {
    if (!selectedStock) return;
    const saleValue = selectedStock.current_price * tradeQuantity;
    const transaction = { id: Date.now(), name: `Sell ${selectedStock.symbol} (${tradeQuantity} qty)`, amount: saleValue, type: 'credit', category: 'Investment', date: new Date().toISOString().split('T')[0] };
    setTransactions([transaction, ...transactions]);
    const existingHolding = portfolio.find(p => p.symbol === selectedStock.symbol);
    if (existingHolding) {
      if (existingHolding.quantity <= tradeQuantity) setPortfolio(portfolio.filter(p => p.symbol !== selectedStock.symbol));
      else setPortfolio(portfolio.map(p => p.symbol === selectedStock.symbol ? { ...p, quantity: p.quantity - parseFloat(tradeQuantity) } : p));
    }
    setIsSellModalOpen(false);
  };

  const getCurrencySymbol = (currency) => {
    switch(currency) { case 'INR': return '₹'; case 'USD': return '$'; case 'EUR': return '€'; case 'GBP': return '£'; default: return currency + ' '; }
  };

  // --- CHARTING MOCK (Since API Key needed for history) ---
  const handleShowChart = async (stock, range = '1mo') => {
    setChartStock(stock); setChartRange(range); setChartLoading(true); setIsChartModalOpen(true);
    setTimeout(() => {
      const dataPoints = range === '1d' ? 24 : (range === '1mo' ? 30 : 12);
      const history = [];
      let price = stock.current_price * 0.9; 
      for (let i = 0; i < dataPoints; i++) {
        const volatility = (Math.random() - 0.45) * 0.05; 
        price = price * (1 + volatility);
        let label = `${i+1}`; if (range === '1d') label = `${i}:00`; if (range === '1mo') label = `Day ${i+1}`;
        history.push({ date: label, price: price });
      }
      setChartHistory(history); setChartLoading(false);
    }, 600);
  };

  const handleManualRefresh = () => {
    if (searchQuery) handleSearch();
  };

  return (
    <>
      <style>{toggleStyles}</style>
      <div className={`flex h-screen font-sans transition-colors duration-300 ${theme.appBg} ${theme.textMain}`}>
        
        {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
        
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center"><Wallet className="text-white" size={20} /></div>
              <span className="text-xl font-bold tracking-tight">Finova<span className="text-indigo-400">.</span></span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              <NavItem icon={<LayoutDashboard size={20} />} label="Overview" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <NavItem icon={<TrendingUp size={20} />} label="Global Markets" isActive={activeTab === 'stocks'} onClick={() => setActiveTab('stocks')} />
              <NavItem icon={<ArrowRightLeft size={20} />} label="Transactions" isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
              <NavItem icon={<PieChart size={20} />} label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
              <NavItem icon={<CreditCard size={20} />} label="My Cards" isActive={activeTab === 'cards'} onClick={() => setActiveTab('cards')} />
            </nav>
            <div className="p-4 border-t border-slate-800">
              <div className="mb-4 p-3 bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Current Plan</p>
                <div className="flex bg-slate-900 p-1 rounded-lg">
                  <button onClick={() => setUserPlan('free')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${userPlan === 'free' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Free</button>
                  <button onClick={() => setUserPlan('pro')} className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1 ${userPlan === 'pro' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Pro <Crown size={10} /></button>
                </div>
              </div>
              <div 
                className="mt-4 flex items-center gap-3 p-3 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => setActiveTab('settings')}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">{userProfile.name.charAt(0).toUpperCase()}</div>
                <div className="flex-1 overflow-hidden"><p className="text-sm font-medium truncate">{userProfile.name}</p><p className="text-xs text-slate-400 truncate">{userPlan === 'pro' ? 'Pro Investor' : 'Free Account'}</p></div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className={`h-16 border-b flex items-center justify-between px-4 lg:px-8 transition-colors duration-300 ${theme.headerBg}`}>
            <div className="flex items-center gap-4"><button onClick={toggleSidebar} className={`p-2 lg:hidden rounded-lg ${theme.hoverBg}`}><Menu size={20} /></button><h1 className="text-xl font-bold hidden sm:block">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1></div>
            <div className="flex items-center gap-4">
              <div className="toggleWrapper"><input type="checkbox" className="input" id="themeToggle" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} /><label htmlFor="themeToggle" className="toggle"><span className="toggle__handler"><span className="crater crater--1"></span><span className="crater crater--2"></span><span className="crater crater--3"></span></span><span className="star star--1"></span><span className="star star--2"></span><span className="star star--3"></span><span className="star star--4"></span><span className="star star--5"></span><span className="star star--6"></span></label></div>
              <div className="relative"><button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 relative rounded-lg transition-colors ${theme.hoverBg}`}><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
              {showNotifications && (<div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-xl border ${theme.cardBg} z-50 animate-in fade-in slide-in-from-top-2`}>
                <div className="p-4 border-b border-slate-100 dark:border-slate-800"><h4 className="font-bold">Notifications</h4></div>
                <div className="max-h-64 overflow-y-auto">{notifications.map(n => (<div key={n.id} className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><div className="flex items-start gap-3"><div className={`mt-1 p-1.5 rounded-full ${n.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : (n.type === 'negative' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600')}`}>{n.type === 'positive' ? <TrendingUp size={14} /> : (n.type === 'negative' ? <AlertCircle size={14} /> : <Bell size={14} />)}</div><div><p className="text-sm font-medium">{n.title}</p><p className={`text-xs ${theme.textSub}`}>{n.message}</p><p className="text-[10px] text-slate-400 mt-1">{n.time}</p></div></div></div>))}</div>
                <div className="p-2 text-center border-t border-slate-100 dark:border-slate-800"><button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 py-2">Mark all as read</button></div>
              </div>)}</div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-8" onClick={() => setShowNotifications(false)}>
            {activeTab === 'dashboard' && (
              <>
                <div className="mb-8"><h2 className="text-2xl font-bold">Welcome back, {userProfile.name.split(' ')[0]}! 👋</h2><p className={theme.textSub}>Here's what's happening with your finance today.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard title="Total Balance" amount={`₹${financials.balance.toLocaleString()}`} trend="+2.5%" isPositive={true} icon={<Wallet className="text-white" size={24} />} color="bg-indigo-600" theme={theme} />
                  <StatCard title="Investments" amount={`₹${portfolioValue.toLocaleString()}`} trend="+8.4%" isPositive={true} icon={<TrendingUp className="text-white" size={24} />} color="bg-violet-600" theme={theme} />
                  <StatCard title="Total Income" amount={`₹${financials.income.toLocaleString()}`} trend="+12%" isPositive={true} icon={<ArrowDownRight className="text-white" size={24} />} color="bg-emerald-500" theme={theme} />
                  <StatCard title="Total Expenses" amount={`₹${financials.expense.toLocaleString()}`} trend="-4.1%" isPositive={false} icon={<ArrowUpRight className="text-white" size={24} />} color="bg-rose-500" theme={theme} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm transition-colors duration-300 ${theme.cardBg}`}>
                    <div className="flex items-center justify-between mb-6"><h3 className="font-bold">Financial Overview</h3></div>
                    <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}><defs><linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient><linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.gridColor} opacity={0.5} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} /><Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: isDarkMode ? '#fff' : '#1e293b' }} /><Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" /><Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" /></AreaChart></ResponsiveContainer></div>
                  </div>
                  <div className={`p-6 rounded-2xl border shadow-sm transition-colors duration-300 ${theme.cardBg}`}>
                    <div className="flex items-center justify-between mb-6"><h3 className="font-bold">{portfolio.length > 0 ? 'My Investments' : 'Recent Activity'}</h3><button onClick={() => portfolio.length > 0 ? setActiveTab('stocks') : setIsTransactionModalOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 transition-colors">{portfolio.length > 0 ? <ArrowUpRight size={20} /> : <Plus size={20} />}</button></div>
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                      {portfolio.length > 0 ? (
                        portfolio.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">{p.symbol[0]}</div><div><h4 className="font-bold text-sm">{p.symbol}</h4><p className={`text-xs ${theme.textSub}`}>{p.quantity} shares</p></div></div>
                            <div className="flex items-center gap-4"><div className="text-right"><p className="font-bold text-sm">₹{(p.quantity * p.avgPrice).toLocaleString()}</p><p className="text-xs text-emerald-500">Hold</p></div><button onClick={() => openSellModal(p)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors" title="Sell Stock"><Minus size={16} /></button></div>
                          </div>
                        ))
                      ) : (
                        transactions.slice(0, 5).map((t) => (<TransactionItem key={t.id} name={t.name} date={t.date} amount={`${t.type === 'debit' ? '-' : '+'}₹${t.amount}`} type={t.type} theme={theme} />))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* --- ANALYTICS VIEW --- */}
            {activeTab === 'analytics' && (
              <div className="max-w-6xl mx-auto">
                <div className="mb-8"><h2 className="text-2xl font-bold flex items-center gap-3"><PieChart className="text-indigo-500" />Spending & Budgeting</h2><p className={theme.textSub}>Track expenses and set monthly limits.</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-3xl border shadow-sm ${theme.cardBg}`}>
                    <h3 className="font-bold mb-6">Expense Breakdown</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                      <div className="h-64 w-64"><ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">{expenseBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}</Pie><Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /></RePieChart></ResponsiveContainer></div>
                      <div className="flex-1 w-full sm:w-auto"><div className="space-y-3">{expenseBreakdown.map((item, index) => (<div key={index} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div><span className="text-sm font-medium">{item.name}</span></div><span className="text-sm font-bold">₹{item.value.toLocaleString()}</span></div>))}</div></div>
                    </div>
                  </div>
                  <div className={`p-8 rounded-3xl border shadow-sm ${theme.cardBg}`}>
                    <h3 className="font-bold mb-6 flex items-center gap-2"><Lock size={18} className="text-emerald-500" /> Budget Goals</h3>
                    <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                      {budgetProgress.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">{item.category}</span><div className="flex items-center gap-2">{editingBudgetCategory === item.category ? (<div className="flex items-center gap-1"><input type="number" className={`w-20 px-2 py-1 text-xs rounded border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`} placeholder="Limit" value={newBudgetLimit} onChange={(e) => setNewBudgetLimit(e.target.value)} autoFocus /><button onClick={() => updateBudget(item.category)} className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"><CheckCircle2 size={14} /></button><button onClick={() => setEditingBudgetCategory(null)} className="p-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"><X size={14} /></button></div>) : (<div className="flex items-center gap-2"><span className={`text-xs font-bold ${item.percentage > 100 ? 'text-rose-500' : (item.percentage > 80 ? 'text-amber-500' : 'text-slate-500')}`}>₹{item.spent.toLocaleString()} / ₹{item.limit.toLocaleString()}</span><button onClick={() => { setEditingBudgetCategory(item.category); setNewBudgetLimit(item.limit); }} className="text-slate-400 hover:text-indigo-500 transition-colors"><Edit3 size={14} /></button></div>)}</div></div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${item.percentage > 100 ? 'bg-rose-500' : (item.percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500')}`} style={{ width: `${Math.min(item.percentage, 100)}%` }}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TRANSACTIONS VIEW --- */}
            {activeTab === 'transactions' && (
              <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex items-center justify-between"><div><h2 className="text-2xl font-bold flex items-center gap-3"><ArrowRightLeft className="text-indigo-500" />Transaction History</h2><p className={theme.textSub}>Manage your income and expenses.</p></div><button onClick={() => setIsTransactionModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"><Plus size={18} /> Add New</button></div>
                <div className={`rounded-2xl border shadow-sm overflow-hidden ${theme.cardBg}`}><div className="overflow-x-auto"><table className="w-full text-left"><thead className={`text-xs uppercase ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><tr><th className="px-6 py-4 font-semibold">Transaction</th><th className="px-6 py-4 font-semibold">Category</th><th className="px-6 py-4 font-semibold">Date</th><th className="px-6 py-4 font-semibold">Amount</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{transactions.map((t) => (<tr key={t.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors`}><td className="px-6 py-4"><div className="font-medium">{t.name}</div><div className={`text-xs ${t.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.type === 'credit' ? 'Income' : 'Expense'}</div></td><td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{t.category || 'Other'}</span></td><td className={`px-6 py-4 text-sm ${theme.textSub}`}>{t.date}</td><td className={`px-6 py-4 font-bold ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}</td><td className="px-6 py-4 text-right"><button onClick={() => handleDeleteTransaction(t.id)} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 size={18} /></button></td></tr>))}</tbody></table></div></div>
              </div>
            )}

            {/* --- CARDS VIEW --- */}
            {activeTab === 'cards' && (
              <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex items-center justify-between"><div><h2 className="text-2xl font-bold flex items-center gap-3"><CreditCard className="text-indigo-500" />My Cards</h2><p className={theme.textSub}>Manage your payment methods.</p></div><button onClick={() => setIsCardModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"><Plus size={18} /> Add New Card</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{cards.map((card) => (<div key={card.id} className={`relative p-6 rounded-3xl text-white bg-gradient-to-br ${card.gradient} shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}><div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div><div className="absolute -left-8 -bottom-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div><div className="flex justify-between items-start mb-8 relative z-10"><div className="text-lg font-bold tracking-wider">{card.bank}</div><div className="italic font-serif opacity-80">{card.type}</div></div><div className="mb-6 relative z-10"><div className="flex items-center gap-2 font-mono text-xl tracking-widest text-shadow-sm">{card.number}<Copy size={14} className="opacity-50 hover:opacity-100 cursor-pointer" /></div></div><div className="flex justify-between items-end relative z-10"><div><div className="text-[10px] uppercase opacity-70 mb-1">Card Holder</div><div className="font-medium tracking-wide">{card.holder}</div></div><div><div className="text-[10px] uppercase opacity-70 mb-1">Expires</div><div className="font-medium tracking-wide">{card.expiry}</div></div></div><button onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} className="text-white" /></button></div>))}<button onClick={() => setIsCardModalOpen(true)} className={`flex flex-col items-center justify-center gap-3 h-56 rounded-3xl border-2 border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'} transition-all group`}><div className={`p-4 rounded-full ${isDarkMode ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-white group-hover:bg-indigo-50'} transition-colors shadow-sm`}><Plus size={24} className="text-indigo-500" /></div><span className={`font-medium ${theme.textSub}`}>Add New Card</span></button></div>
              </div>
            )}

            {/* --- GLOBAL STOCKS TAB --- */}
            {activeTab === 'stocks' && (
              <div className="max-w-6xl mx-auto">
                <div className="mb-8"><h2 className="text-2xl font-bold flex items-center gap-3 mb-2"><Globe className="text-indigo-500" />Global Stock Market</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400"><p className={theme.textSub}>Live data from Alpha Vantage API. (Limit: 5 calls/min)</p><div className="flex items-center gap-2">{dataSource === 'Alpha Vantage (Primary)' ? (<span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-medium"><Zap size={10} /> Alpha Vantage</span>) : dataSource.includes('Twelve') ? (<span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-medium"><Wifi size={10} /> Twelve Data</span>) : (<span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100 font-medium"><CloudLightning size={10} /> {dataSource}</span>)}{lastUpdated && <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">Updated: {lastUpdated.toLocaleTimeString()}</span>}</div></div>
                </div>
                {!ALPHA_VANTAGE_API_KEY && (<div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl flex items-start gap-3"><AlertCircle className="text-amber-600 mt-1 flex-shrink-0" size={20} /><div className="text-sm"><h4 className="font-bold text-amber-900">API Key Missing</h4><p className="text-amber-700 mt-1">You have not provided an Alpha Vantage API Key. The app is running in offline mode. Please add your key to <code>App.jsx</code> to see real live market data.</p></div></div>)}
                <div className="flex items-center gap-4 max-w-md mb-8">
                  <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><Search size={20} className="text-slate-400" /><input type="text" placeholder="Search stocks (e.g. RELIANCE.BSE, AAPL)" className={`bg-transparent outline-none w-full text-sm ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} /></div>
                  <button onClick={handleManualRefresh} className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} title="Refresh Prices"><RefreshCw size={20} /></button>
                  <button onClick={handleSearch} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors">{loading ? 'Searching...' : 'Search'}</button>
                </div>
                {loading ? (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3].map(i => (<div key={i} className={`h-40 rounded-2xl animate-pulse ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>))}</div>) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {stockData.length > 0 ? stockData.map((stock) => (
                      <div key={stock.id} className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all ${theme.cardBg} flex flex-col justify-between relative overflow-hidden`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>{(stock.symbol || '?').substring(0, 1)}</div><div><h3 className="font-bold">{stock.symbol}</h3><span className={`text-xs ${theme.textSub}`}>{stock.exchange}</span></div></div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${stock.percent_change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{stock.percent_change >= 0 ? '+' : ''}{stock.percent_change.toFixed(2)}%</div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                           <div className="flex justify-between items-end"><div><p className={`text-xs ${theme.textSub}`}>Current Price</p><h4 className="text-2xl font-bold tracking-tight">{getCurrencySymbol(stock.currency)}{stock.current_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4></div></div>
                           <div className="flex gap-2 w-full mt-2 flex-wrap">
                             <button onClick={() => handleShowChart(stock)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors"><BarChart2 size={14} /> Chart</button>
                             <button onClick={() => openBuyModal(stock)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold transition-colors">Buy</button>
                             <button onClick={() => handleAnalyze(stock)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition-colors"><Brain size={14} /> AI</button>
                           </div>
                        </div>
                      </div>
                    )) : <div className="col-span-3 text-center py-12 text-slate-400">Search for a stock symbol (e.g. RELIANCE.BSE, AAPL)</div>}
                  </div>
                )}
                {error && (<div className="mt-8 bg-rose-50 text-rose-700 p-4 rounded-xl flex items-center gap-3 justify-center"><AlertCircle size={20} /><span>{error}</span></div>)}
              </div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8"><h2 className="text-2xl font-bold flex items-center gap-3"><Settings className="text-indigo-500" /> Settings & Preferences</h2><p className={theme.textSub}>Manage your account and app settings.</p></div>
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border shadow-sm ${theme.cardBg}`}>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><User size={18} className="text-indigo-500" /> User Profile</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4"><div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">{userProfile.name.charAt(0).toUpperCase()}</div><div className="flex-1"><label className="text-xs font-bold uppercase tracking-wider mb-1 block">Full Name</label><input type="text" className={`w-full px-4 py-2 rounded-lg border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} /></div></div>
                      <div><label className="text-xs font-bold uppercase tracking-wider mb-1 block">Email Address</label><div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}><Mail size={16} className="text-slate-400" /><input type="email" className="bg-transparent outline-none w-full" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} /></div></div>
                    </div>
                  </div>
                  <div className={`p-6 rounded-2xl border shadow-sm ${theme.cardBg}`}>
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={18} className="text-indigo-500" /> App Preferences</h3>
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>{isDarkMode ? <Moon size={20} /> : <Sun size={20} />}</div><div><p className="font-medium">Dark Mode</p><p className={`text-xs ${theme.textSub}`}>Switch between light and dark themes</p></div></div><div className="toggleWrapper scale-75 origin-right"><input type="checkbox" className="input" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} /><label className="toggle"><span className="toggle__handler"><span className="crater crater--1"></span><span className="crater crater--2"></span><span className="crater crater--3"></span></span><span className="star star--1"></span><span className="star star--2"></span><span className="star star--3"></span><span className="star star--4"></span><span className="star star--5"></span><span className="star star--6"></span></label></div></div>
                  </div>
                  <div className="p-6 rounded-2xl border border-rose-100 bg-rose-50/50 dark:bg-rose-900/10 dark:border-rose-900/30"><h3 className="font-bold mb-4 flex items-center gap-2 text-rose-600"><AlertCircle size={18} /> Danger Zone</h3><p className="text-sm text-slate-500 mb-4">Resetting the app will clear all your transactions, cards, and profile settings. This action cannot be undone.</p><button onClick={handleResetApp} className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium rounded-lg transition-colors shadow-sm"><LogOut size={16} /> Reset App Data</button></div>
                </div>
              </div>
            )}
          </main>

          {/* --- TRANSACTION MODAL --- */}
          {isTransactionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${theme.modalBg} animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Add Transaction</h3><button onClick={() => setIsTransactionModalOpen(false)}><X size={20} /></button></div>
                <div className="space-y-4">
                  <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Name</label><input type="text" placeholder="e.g. Grocery, Freelance" className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={newTransaction.name} onChange={(e) => setNewTransaction({...newTransaction, name: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Amount (₹)</label><input type="number" placeholder="0.00" className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={newTransaction.amount} onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})} /></div>
                    <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Category</label><select className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={newTransaction.category} onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                  </div>
                  <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Type</label><div className="flex gap-4"><button onClick={() => setNewTransaction({...newTransaction, type: 'credit'})} className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all ${newTransaction.type === 'credit' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-transparent bg-slate-100 text-slate-500'}`}>Income</button><button onClick={() => setNewTransaction({...newTransaction, type: 'debit'})} className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all ${newTransaction.type === 'debit' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-transparent bg-slate-100 text-slate-500'}`}>Expense</button></div></div>
                  <button onClick={handleAddTransaction} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4">Save Transaction</button>
                </div>
              </div>
            </div>
          )}

          {/* --- ADD CARD MODAL --- */}
          {isCardModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${theme.modalBg} animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Add New Card</h3><button onClick={() => setIsCardModalOpen(false)}><X size={20} /></button></div>
                <div className="space-y-4">
                  <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Bank Name</label><input type="text" placeholder="e.g. HDFC Bank" className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={newCard.bank} onChange={(e) => setNewCard({...newCard, bank: e.target.value})} /></div>
                  <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Card Number (Masked)</label><input type="text" placeholder="**** **** **** 1234" className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={newCard.number} onChange={(e) => setNewCard({...newCard, number: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Expiry</label><input type="text" placeholder="MM/YY" className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={newCard.expiry} onChange={(e) => setNewCard({...newCard, expiry: e.target.value})} /></div>
                    <div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Type</label><select className={`w-full px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} value={newCard.type} onChange={(e) => setNewCard({...newCard, type: e.target.value})}><option value="Visa">Visa</option><option value="Mastercard">Mastercard</option><option value="Amex">Amex</option></select></div>
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Card Style</label>
                    <div className="flex gap-2">
                      {CARD_GRADIENTS.map((gradient, idx) => (<button key={idx} onClick={() => setNewCard({...newCard, gradient})} className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} ${newCard.gradient === gradient ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`} />))}
                    </div>
                  </div>
                  <button onClick={handleAddCard} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4">Save Card</button>
                </div>
              </div>
            </div>
          )}

          {/* --- BUY STOCK MODAL --- */}
          {isBuyModalOpen && selectedStock && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 ${theme.modalBg} animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center mb-6">
                  <div><h3 className="text-xl font-bold">Buy Stock</h3><p className="text-sm text-slate-500">{selectedStock.symbol}</p></div>
                  <button onClick={() => setIsBuyModalOpen(false)}><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                    <span className="text-sm">Current Price</span>
                    <span className="font-bold text-lg">₹{selectedStock.current_price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Quantity</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg font-bold">-</button>
                      <input type="number" className="flex-1 text-center font-bold text-xl bg-transparent outline-none" value={tradeQuantity} onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                      <button onClick={() => setTradeQuantity(tradeQuantity + 1)} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg font-bold">+</button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-sm font-medium">Total Cost</span>
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{(selectedStock.current_price * tradeQuantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <button onClick={executeBuy} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold mt-2 shadow-lg shadow-emerald-500/20 transition-all">Confirm Purchase</button>
                </div>
              </div>
            </div>
          )}

          {/* --- SELL STOCK MODAL --- */}
          {isSellModalOpen && selectedStock && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 ${theme.modalBg} animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center mb-6">
                  <div><h3 className="text-xl font-bold">Sell Stock</h3><p className="text-sm text-slate-500">{selectedStock.symbol}</p></div>
                  <button onClick={() => setIsSellModalOpen(false)}><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                    <span className="text-sm">Current Value</span>
                    <span className="font-bold text-lg">₹{selectedStock.current_price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textSub}`}>Quantity (Max: {portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity})</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg font-bold">-</button>
                      <input 
                        type="number" 
                        className="flex-1 text-center font-bold text-xl bg-transparent outline-none" 
                        value={tradeQuantity} 
                        onChange={(e) => setTradeQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity || 1))} 
                      />
                      <button onClick={() => setTradeQuantity(Math.min(tradeQuantity + 1, portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity))} className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg font-bold">+</button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-sm font-medium">Total Return</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{(selectedStock.current_price * tradeQuantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <button onClick={executeSell} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold mt-2 shadow-lg shadow-rose-500/20 transition-all">Confirm Sale</button>
                </div>
              </div>
            </div>
          )}

          {/* --- ANALYSIS MODAL --- */}
          {analysisModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
              <div className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 ${theme.modalBg} animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg"><Brain className="text-indigo-600" size={24} /></div>
                    <div>
                      <div className="flex items-center gap-2"><h3 className="text-xl font-bold">AI Analysis</h3><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${userPlan === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{userPlan === 'pro' ? 'Pro Tier' : 'Free Tier'}</span></div>
                      <p className={`text-sm ${theme.textSub}`}>Analyzing {analyzingStock?.symbol} for {analyzingStock?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setAnalysisModalOpen(false)} className={`p-2 rounded-lg ${theme.hoverBg}`}><X size={20} /></button>
                </div>
                {isAnalyzing ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center"><Loader2 size={48} className="text-indigo-500 animate-spin mb-4" /><p className="font-medium">Crunching market data...</p><p className={`text-sm ${theme.textSub} mt-1`}>Analyzing patterns, fundamentals, and sentiment...</p></div>
                ) : analysisError ? (
                   <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-start gap-3"><AlertCircle size={20} className="mt-0.5" /><div><p className="font-bold">Analysis Failed</p><p className="text-sm">{analysisError}</p></div></div>
                ) : analysisResult ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border ${theme.cardBg} relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full"></div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme.textSub}`}>Signal</p>
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`text-2xl font-bold ${(analysisResult.technical_analysis?.chart_sentiment || "Neutral") === 'Bullish' ? 'text-emerald-500' : 'text-rose-500'}`}>{analysisResult.technical_analysis?.chart_sentiment || "Neutral"}</span>
                           {(analysisResult.technical_analysis?.chart_sentiment || "Neutral") === 'Bullish' ? <TrendingUp size={20} className="text-emerald-500"/> : <CheckCircle2 className="text-slate-400" size={20} />}
                        </div>
                        <p className="text-xs text-slate-500">Based on technical indicators</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${theme.cardBg}`}>
                         <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme.textSub}`}>1-Day Forecast</p>
                         <span className="text-2xl font-bold text-indigo-500">{getCurrencySymbol(analyzingStock?.currency)}{analysisResult.predictions?.['1_day']?.predicted_price?.toFixed(2) || "N/A"}</span>
                         <p className={`text-xs mt-1 ${(analysisResult.predictions?.['1_day']?.change_percent || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{(analysisResult.predictions?.['1_day']?.change_percent || 0) >= 0 ? '+' : ''}{analysisResult.predictions?.['1_day']?.change_percent?.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl border ${theme.cardBg}`}><p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme.textSub}`}>Summary</p><p className={`text-sm leading-relaxed ${theme.textSub}`}>{analysisResult.summary || "No summary available."}</p></div>
                    <div className="relative">
                      {userPlan === 'free' && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200">
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-xs mx-auto border border-slate-100 dark:border-slate-700">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3"><Lock size={20} /></div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Unlock Pro Analysis</h4>
                            <p className="text-xs text-slate-500 mb-4">Get 30-day forecasts, risk management strategies, and deep fundamentals.</p>
                            <button onClick={() => setUserPlan('pro')} className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all">Upgrade Now</button>
                          </div>
                        </div>
                      )}
                      <div className={`space-y-4 ${userPlan === 'free' ? 'opacity-50 pointer-events-none select-none grayscale-[0.5]' : ''}`}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`p-4 rounded-xl border ${theme.cardBg} border-indigo-100 dark:border-slate-700`}>
                             <div className="flex items-center gap-2 mb-2"><p className={`text-xs font-bold uppercase tracking-wider ${theme.textSub}`}>7-Day Forecast</p><Crown size={12} className="text-amber-500" /></div>
                             <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{getCurrencySymbol(analyzingStock?.currency)}{analysisResult.predictions?.['7_day']?.predicted_price?.toFixed(2) || "N/A"}</span>
                             <p className={`text-xs mt-1 font-medium ${(analysisResult.predictions?.['7_day']?.change_percent || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{(analysisResult.predictions?.['7_day']?.change_percent || 0) >= 0 ? '+' : ''}{analysisResult.predictions?.['7_day']?.change_percent?.toFixed(2)}%</p>
                          </div>
                          <div className={`p-4 rounded-xl border ${theme.cardBg} border-indigo-100 dark:border-slate-700`}>
                             <div className="flex items-center gap-2 mb-2"><p className={`text-xs font-bold uppercase tracking-wider ${theme.textSub}`}>30-Day Forecast</p><Crown size={12} className="text-amber-500" /></div>
                             <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{getCurrencySymbol(analyzingStock?.currency)}{analysisResult.predictions?.['30_day']?.predicted_price?.toFixed(2) || "N/A"}</span>
                             <p className={`text-xs mt-1 font-medium ${(analysisResult.predictions?.['30_day']?.change_percent || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{(analysisResult.predictions?.['30_day']?.change_percent || 0) >= 0 ? '+' : ''}{analysisResult.predictions?.['30_day']?.change_percent?.toFixed(2)}%</p>
                          </div>
                        </div>
                        <div className={`p-4 rounded-xl border ${theme.cardBg}`}>
                          <div className="flex items-center gap-2 mb-3"><p className={`text-xs font-bold uppercase tracking-wider ${theme.textSub}`}>Risk Management AI</p><Crown size={12} className="text-amber-500" /></div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg"><p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">Stop Loss</p><p className="text-sm font-bold text-rose-700 dark:text-rose-300">{getCurrencySymbol(analyzingStock?.currency)}{analysisResult.risk_management?.stop_loss?.toFixed(2) || "-"}</p></div>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"><p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Take Profit</p><p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{getCurrencySymbol(analyzingStock?.currency)}{analysisResult.risk_management?.take_profit?.toFixed(2) || "-"}</p></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"><p className="text-[10px] text-slate-500 font-bold uppercase">Risk/Reward</p><p className="text-sm font-bold text-slate-700 dark:text-slate-300">{analysisResult.risk_management?.risk_reward_ratio?.toFixed(2) || "-"}</p></div>
                          </div>
                        </div>
                        <div className={`p-4 rounded-xl border ${theme.cardBg}`}>
                          <div className="flex items-center gap-2 mb-3"><p className={`text-xs font-bold uppercase tracking-wider ${theme.textSub}`}>Deep Dive Factors</p><Crown size={12} className="text-amber-500" /></div>
                          <ul className="space-y-2">
                            {analysisResult.reasoning?.fundamental_factors?.slice(0, 2).map((factor, idx) => (<li key={idx} className="text-xs flex items-start gap-2 text-slate-600 dark:text-slate-400"><span className="mt-0.5 text-indigo-500">•</span> {factor}</li>))}
                            {analysisResult.reasoning?.pattern_factors?.slice(0, 2).map((factor, idx) => (<li key={idx} className="text-xs flex items-start gap-2 text-slate-600 dark:text-slate-400"><span className="mt-0.5 text-purple-500">•</span> {factor}</li>))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800"><button onClick={() => setAnalysisModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm">Close</button></div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* --- STOCK CHART MODAL --- */}
          {isChartModalOpen && chartStock && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className={`w-full max-w-3xl rounded-2xl shadow-2xl p-6 ${theme.modalBg} animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      {chartStock.symbol} 
                      <span className="text-sm font-normal text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md dark:bg-slate-800 dark:text-slate-400">{chartStock.exchange}</span>
                    </h3>
                    <p className={`text-sm ${theme.textSub}`}>{chartStock.name}</p>
                  </div>
                  <button onClick={() => setIsChartModalOpen(false)} className={`p-2 rounded-lg ${theme.hoverBg}`}><X size={20} /></button>
                </div>
                
                <div className="mb-6 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                   {/* Note: Free tier Alpha Vantage doesn't support flexible ranges well, we stick to Daily */}
                   {['Daily'].map(range => (
                     <button 
                       key={range}
                       onClick={() => {}} 
                       className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white`}
                     >
                       {range.toUpperCase()}
                     </button>
                   ))}
                </div>

                <div className="h-80 w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 p-4 relative">
                  {chartLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Loader2 size={32} className="text-indigo-500 animate-spin mb-2" />
                      <p className="text-xs text-slate-500">Loading market data...</p>
                    </div>
                  ) : chartHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartHistory}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} opacity={0.5} />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10}} 
                          minTickGap={30}
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10}} 
                          tickFormatter={(val) => `₹${val.toFixed(0)}`}
                          width={40}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          formatter={(val) => [`₹${val.toFixed(2)}`, 'Price']}
                          labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#6366f1" 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill="url(#colorPrice)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      No chart data available. (API Limit or Network Error)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {icon} <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function StatCard({ title, amount, trend, isPositive, icon, color, theme }) {
  return (
    <div className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 ${theme.cardBg}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-lg shadow-indigo-50`}>{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{trend}</span>
      </div>
      <div>
        <p className={`text-sm font-medium ${theme.textSub}`}>{title}</p>
        <h3 className="text-2xl font-bold mt-1">{amount}</h3>
      </div>
    </div>
  );
}

function TransactionItem({ name, date, amount, type, theme }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group ${theme.hoverBg}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{type === 'credit' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}</div>
        <div><h4 className="font-bold text-sm">{name}</h4><p className={`text-xs ${theme.textSub}`}>{date}</p></div>
      </div>
      <span className={`font-bold text-sm ${type === 'credit' ? 'text-emerald-600' : theme.textMain}`}>{amount}</span>
    </div>
  );
}