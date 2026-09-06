  const [interceptText, setInterceptText] = useState("");
  const [isIntercepting, setIsIntercepting] = useState(false);

  const handleIntercept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interceptText.trim()) return;
    setIsIntercepting(true);
    try {
      const res = await axios.post("http://localhost:8000/api/pipeline/ingest/intercept", { text: interceptText });
      setPipelineStatus(`Target intercepted. Anomaly score: ${res.data.result.anomaly_score.toFixed(3)}`);
      if (res.data.stream) setAilStream(res.data.stream);
      setInterceptText("");
      
      const ent = await axios.get("http://localhost:8000/api/entities");
      setEntities(ent.data);
      const alt = await axios.get("http://localhost:8000/api/alerts");
      setAlerts(alt.data);
    } catch(err: any) {
      setPipelineStatus(`Intercept Error: ${err.message}`);
    } finally {
      setIsIntercepting(false);
    }
  };
