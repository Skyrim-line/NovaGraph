import React, { useEffect, useRef, useState } from "react";
import "./pages.css";
import logo from "./image/white-logo.svg";
import arrow_right from "./image/arrow-right.svg";
import Button_arrow from "./image/button-arrow.svg";
import Line from "./image/line1.svg";
import Demo1 from "./image/demo1.svg";
import WASM from "./image/wasm.svg";
import Nova from "./image/logo_only.svg";
import CanvasBackground from "../components/effect/canvas";
// import Shadow from "./image/Group1.svg";
import UNSW from "./image/UNSW-F.svg";

import { Zap, CloudOff, Monitor, Globe, Github } from "lucide-react";

import { Card, ConfigProvider, theme } from "antd";

const steps = [
  {
    title: "STEP 1",
    heading: "Import Your Data",
    description:
      "Import your graph data files in JSON, CSV, GEXF or GML format.",
  },
  {
    title: "STEP 2",
    heading: "Visualize Your Graph",
    description:
      "Watch as NovaGraph transforms your data into an interactive visualization.",
  },
  {
    title: "STEP 3",
    heading: "Apply Algorithms & Queries",
    description:
      "Select from a library of algorithms to analyze your network, or write queries to filter and explore specific patterns.",
  },
  {
    title: "STEP 4",
    heading: "Export & Share Discoveries",
    description:
      "Save your findings as raw data in JSON or YAML format for further analysis.",
  },
];

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const [hoverIndex, setHoverIndex] = useState(0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      <body>
        <nav className="navbar">
          <img src={logo} alt="NovaGraph" className="logo" />

          {/* Hamburger menu button - visible only on mobile */}
          <div className="hamburger-menu" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Desktop navigation - hidden on mobile */}
          <div className={`nav-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
            <a href="home" onClick={() => setMobileMenuOpen(false)}>
              Home
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </a>
            <a href="#works" onClick={() => setMobileMenuOpen(false)}>
              How it Works
            </a>
            <a href="#cases" onClick={() => setMobileMenuOpen(false)}>
              Use Cases
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
            <span></span>
          </div>

          {/* CTA Button - hidden on mobile */}
          <a href="#/app" className="cta-button">
            Go to NovaGraph
            <img src={arrow_right} alt="arrow-right" />
          </a>

          {/* Overlay for mobile menu */}
          {mobileMenuOpen && (
            <div
              className="mobile-menu-overlay"
              onClick={toggleMobileMenu}></div>
          )}
        </nav>

        <div className="glow" />

        <div className="hero-section">
          <CanvasBackground />
          {/* <canvas ref={canvasRef} id="c" /> */}
          <div className="title-xxlg title-box">
            Visualize, Analyze,
            <span className="block">Discover</span>
          </div>
          <div className="hero-content">
            <p className="body-lg">
              Built on WebAssembly (WASM) technology, NovaGraph transforms your
              graph into interactive visual networks you can explore, analyze,
              and query with near-native speed
            </p>
            <a href="#/app" className="cta-button-large">
              Get Started
            </a>
          </div>
        </div>

        {/* Straight Lines */}
        <div className="lines">
          <img src={Line} alt="line" className="lines" />
        </div>

        <div className="UNSW-Logo">
          <p className="title-med">
            Developed by{" "}
            <a className="unswdb-link" href="https://unswdb.github.io/">
              UNSWDB
            </a>{" "}
            and individuals
          </p>
          <img src={UNSW} alt=" UNSW-Logo" />
        </div>
        <div className="lines">
          <img src={Line} alt="line" className="lines" />
        </div>
        <div className="title-xlg section-2">
          Discover NovaGraph
          <p className="body-lg">
            Making graph visualization accessible to everyone
          </p>
          <img src={Demo1} alt="demo1" />
        </div>
        {/* Straight Lines */}
        <div className="lines">
          <img src={Line} alt="line" className="lines" />
        </div>

        <div className="title-xlg section-2">
          WASM Architecture
          <p className="body-lg">
            Why NovaGraph is blazing fast, even in your browser
          </p>
        </div>
        <div className="wasm">
          <img src={WASM} alt="wasm" />
        </div>

        {/* First row: small + large */}
        <div className="wasm-cards">
          <div className="card-row">
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm, // 使用暗黑主题算法
              }}>
              <Card className="card-small">
                <span className="title-wrapper title-med">
                  <span className="icon-background">
                    <Zap size={24} />
                  </span>
                  Near-Native Performance
                </span>
                <p className="body-med">
                  NovaGraph runs at speeds you'd expect from installed software,
                  not a website. WebAssembly (WASM) is the magic that makes this
                  possible – it's like having a turbocharger for your browser
                </p>
              </Card>

              <Card className="card-large">
                <span className="title-wrapper title-med">
                  <span className="icon-background">
                    <CloudOff size={24} />
                  </span>
                  No Server Processing
                </span>
                <p>
                  Unlike other tools that send your data to faraway servers,
                  NovaGraph processes everything right on your device. Your data
                  never leaves your computer, making analysis both faster and
                  more secure
                </p>
              </Card>
            </ConfigProvider>
          </div>

          {/* Second row: large + small */}
          <div className="card-row">
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm, // use dark theme in homepage
              }}>
              <Card className="card-large">
                <span className="title-wrapper title-med">
                  <span className="icon-background">
                    <Monitor size={24} />
                  </span>
                  Cross-Platform Compatibility
                </span>
                <p>
                  No matter if you use Chrome, Safari, Firefox, or Edge –
                  NovaGraph works the same everywhere. No plugins, no downloads,
                  no compatibility headaches. If your device has a modern
                  browser, you're ready to go
                </p>
              </Card>

              <Card className="card-small">
                <span className="title-wrapper title-med">
                  <span className="icon-background">
                    <Globe size={24} />
                  </span>
                  No Setup Required
                </span>
                <p>
                  We've taken powerful graph tools that researchers love and
                  made them work directly in your browser. This means you get
                  professional-grade analysis without installing complex
                  software
                </p>
              </Card>
            </ConfigProvider>
          </div>
        </div>

        {/* Straight Lines */}
        <div className="lines ">
          <img src={Line} alt="line" className="lines" />
        </div>

        <div className="title-xlg section-2">
          How does it Work?
          <p className="body-lg">From data to discovery in four simple steps</p>
        </div>
        <div className="wasm">
          <img src={WASM} alt="wasm" />
        </div>
        {/* Four Steps Card Part */}
        <div className="steps-container">
          <div className="steps-bar">
            {steps.map((_, index) => (
              <span
                key={index}
                className={hoverIndex === index ? "active" : ""}></span>
            ))}
          </div>

          <div className="steps" onMouseLeave={() => setHoverIndex(0)}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-card ${hoverIndex === index ? "active" : ""}`}
                onMouseEnter={() => setHoverIndex(index)}>
                <div className="step-title">{step.title}</div>
                <div className="step-heading">{step.heading}</div>
                <div className="step-description">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Straight Lines */}
        <div className="lines ">
          <img src={Line} alt="line" className="lines" />
        </div>

        <div className="hero-section" id="footer">
          <img src={Nova} alt="NovaGraph" className="nova" />
          <div className="title-xxlg ">Try NovaGraph Now!</div>
          <div className="hero-content" id="footer">
            <p className="body-lg">
              Get started now to visualize, analyze, and
              <span className="block">discover your own graph</span>
            </p>
            <a href="#/app" className="cta-button-large">
              Go To NovaGraph
              <img src={`${Button_arrow}?v=1`} alt="arrow-right" />
            </a>
          </div>
        </div>

        <footer>
          <div>
            <img src={logo} alt="NovaGraph" />
            <p className="body-sm">
              Copyright © UNSW Database NovaGraph {currentYear}
            </p>
          </div>
          <div className="socials">
            <a href="https://github.com/unswdb">
              <Github size={24} />
            </a>
          </div>
        </footer>
      </body>
    </div>
  );
}

export default Home;
