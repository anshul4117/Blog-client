import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, FileText, ArrowRight, CornerDownLeft, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Bind ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen to custom window event to open spotlight search (from sidebar click)
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-spotlight-search", handleOpen);
    return () => window.removeEventListener("open-spotlight-search", handleOpen);
  }, []);

  // Live filter query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const blogs = JSON.parse(localStorage.getItem("mock_db_blogs") || "[]");
      const drafts = JSON.parse(localStorage.getItem("mock_db_drafts") || "[]");

      const matches = [];

      // Filter publications
      blogs.forEach((b) => {
        if (
          b.title?.toLowerCase().includes(query.toLowerCase()) ||
          b.content?.toLowerCase().includes(query.toLowerCase())
        ) {
          matches.push({ ...b, category: "publication" });
        }
      });

      // Filter drafts
      drafts.forEach((d) => {
        if (
          d.title?.toLowerCase().includes(query.toLowerCase()) ||
          d.content?.toLowerCase().includes(query.toLowerCase())
        ) {
          matches.push({ ...d, category: "draft" });
        }
      });

      setResults(matches.slice(0, 5)); // Cap at 5 matches for spotlight list
      setSelectedIndex(0);
    } catch (err) {
      console.error("Error querying DB for Spotlight:", err);
    }
  }, [query]);

  // Handle keyboard navigation inside search list
  const handleInputKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const handleSelect = (item) => {
    setOpen(false);
    setQuery("");
    if (item.category === "publication") {
      navigate(`/post/${item._id}`);
    } else {
      navigate(`/dashboard/create`); // routes to create/draft workspace
    }
  };

  // Reset query on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-3xl border-primary/10 glass-panel shadow-2xl p-0 overflow-hidden font-sans z-[150] fixed top-[25%] translate-y-0">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-primary/10 relative">
          <Search size={20} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type matching titles or draft keywords..."
            className="flex-1 bg-transparent border-none text-foreground outline-none text-sm font-bold placeholder-muted-foreground/50 w-full"
            autoFocus
          />
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground/45 bg-muted/30 border border-primary/5 px-2 py-1 rounded-lg">
            ESC
          </div>
        </div>

        {/* Scrollable Results Area */}
        <div className="p-4 max-h-[360px] overflow-y-auto no-scrollbar">
          {query.trim() === "" ? (
            <div className="text-center py-10 text-muted-foreground/60 space-y-1.5">
              <Sparkles className="h-10 w-10 mx-auto text-primary/30 animate-pulse" />
              <p className="font-bold text-xs text-foreground uppercase tracking-widest">Spotlight Signal Search</p>
              <p className="text-[11px] max-w-xs mx-auto leading-relaxed">
                Query publication titles, tags, and drafts. Use <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">↑↓</kbd> keys to navigate and <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">Enter</kbd> to select.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/60 space-y-1">
              <p className="font-bold text-xs text-foreground uppercase tracking-widest">No matching signals</p>
              <p className="text-[11px] max-w-xs mx-auto">
                No active publications or drafts matched "{query}".
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-primary/60 mb-2 px-2">Matches Found</p>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer group",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-transparent hover:border-primary/10 hover:bg-muted/15"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={cn(
                        "p-2 rounded-xl shrink-0 transition-colors",
                        item.category === "publication"
                          ? "bg-primary/10 text-primary"
                          : "bg-amber-500/10 text-amber-500"
                      )}>
                        {item.category === "publication" ? <Sparkles size={16} /> : <FileText size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-foreground truncate max-w-[280px]">
                            {item.title}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0",
                            item.category === "publication"
                              ? "bg-primary/20 text-primary border-primary/20"
                              : "bg-amber-500/20 text-amber-500 border-amber-500/20"
                          )}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 leading-normal mt-0.5">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary animate-pulse">
                          <span>Open</span>
                          <CornerDownLeft size={10} className="stroke-[3]" />
                        </div>
                      ) : (
                        <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
