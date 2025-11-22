import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, ZapIcon, BarChartIcon, TagsIcon, ThumbsUpIcon, LightbulbIcon, CheckBadgeIcon, CheckIcon, XIcon, SparklesIcon, LinkedinIcon, GithubIcon, TwitterIcon, MenuIcon, StarIcon, ArrowUpIcon } from './icons';
import { HeroIllustration, MissionIllustration, ContactIllustration } from './Illustrations';



interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
    onSignup: () => void;
    user: { name: string } | null;
    onLogout: () => void;
}
const features = [
    { icon: <ZapIcon />, title: "Instant AI Analysis", description: "Get your resume scored in seconds based on clarity, impact, and ATS best practices." },
    { icon: <TagsIcon />, title: "Keyword Optimization", description: "Identify crucial keywords and skills missing from your resume that match the job description." },
    { icon: <BarChartIcon />, title: "ATS Score & Insights", description: "Understand how an Applicant Tracking System sees your resume and get actionable feedback." }
];

const testimonials = [
    {
        quote: "The ATS score was a game-changer. I went from zero interviews to three offers in two weeks. Highly recommended!",
        name: "Sarah J.",
        role: "Software Engineer",
        avatar: "https://i.pravatar.cc/48?u=sarah"
    },
    {
        quote: "I couldn't figure out why my resume wasn't getting past the initial screening. The keyword suggestions were exactly what I needed.",
        name: "Michael B.",
        role: "Marketing Manager",
        avatar: "https://i.pravatar.cc/48?u=michael"
    },
    {
        quote: "As a recent graduate, this tool gave me the confidence to apply for competitive roles. The feedback is clear, concise, and incredibly helpful.",
        name: "Emily C.",
        role: "UX/UI Designer",
        avatar: "https://i.pravatar.cc/48?u=emily"
    },
    {
        quote: "The detailed performance metrics helped me target exactly which parts of my resume to improve. I saw a noticeable increase in responses from recruiters.",
        name: "David L.",
        role: "Data Analyst",
        avatar: "https://i.pravatar.cc/48?u=david"
    }
];


const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-200 dark:hover:border-cyan-700 transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
);

const KeywordTag = ({ children }) => (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-cyan-50 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 border border-cyan-200/80 dark:border-cyan-800 shadow-sm transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20">
        <SparklesIcon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
        {children}
    </span>
);

const ScoreCircle = ({ score, isPreview, isVisible }) => {
  const viewBoxSize = 200;
  const strokeWidth = isPreview ? 18 : 14;
  const radius = (viewBoxSize / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = React.useState(circumference);

  React.useEffect(() => {
    if (isVisible) {
      const progress = score / 10;
      const newOffset = circumference - progress * circumference;
      const timer = setTimeout(() => setOffset(newOffset), 100);
      return () => clearTimeout(timer);
    }
  }, [score, circumference, isVisible]);

  // Make size smaller on mobile for preview
  const size = isPreview ? 'w-36 h-36 sm:w-48 sm:h-48' : 'w-40 h-40';
  const scoreSize = isPreview ? 'text-4xl sm:text-6xl' : 'text-5xl';
  const scoreSubSize = isPreview ? 'text-lg sm:text-2xl' : 'text-xl';
  
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      <svg className="absolute w-full h-full transform -rotate-90" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <circle
          className={"stroke-slate-200 dark:stroke-slate-700"}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
        />
        <circle
          className={`stroke-cyan-500 transition-all duration-1000 ease-out`}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
        />
      </svg>
      <div className={`text-center transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`${scoreSize} font-bold text-cyan-500`}>{score.toFixed(1)}</span>
        <span className={`${scoreSubSize} text-slate-500 dark:text-slate-400`}>/10</span>
      </div>
    </div>
  );
};

const TestimonialCard = ({ quote, name, role, avatar }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 h-full">
        <div className="flex items-center mb-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4 flex-shrink-0 object-cover" />
            <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
            </div>
        </div>
        <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
            ))}
        </div>
        <p className="text-slate-600 dark:text-slate-300 italic">"{quote}"</p>
    </div>
);


const LandingPage = ({ onGetStarted, onLogin, onSignup }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [isVisible, setIsVisible] = useState({});
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [contactStatus, setContactStatus] = useState('idle');
    const [hoveredButton, setHoveredButton] = useState(null);

    const sectionsRef = useRef({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({...prev, [entry.target.id]: true}));
                    }
                });
            },
            { threshold: 0.15 }
        );

        const sectionKeys = Object.keys(sectionsRef.current);
        sectionKeys.forEach((key) => {
            const el = sectionsRef.current[key];
            if (el) observer.observe(el);
        });

        return () => {
             sectionKeys.forEach((key) => {
                const el = sectionsRef.current[key];
                if (el) observer.unobserve(el);
            });
        };
    }, []);
    
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);


    useEffect(() => {
        const sections = ['features', 'preview', 'testimonials', 'about', 'contact'];
        
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        });

        const sectionElements = sections.map(id => document.getElementById(id));
        sectionElements.forEach(el => {
            if (el) observer.observe(el);
        });

        return () => {
            sectionElements.forEach(el => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showBackToTop && window.pageYOffset > 400) {
                setShowBackToTop(true);
            } else if (showBackToTop && window.pageYOffset <= 400) {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showBackToTop]);

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactStatus('submitting');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setContactStatus('success');
        setTimeout(() => setContactStatus('idle'), 5000);
    };

    const scrollTo = (id) => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
             targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        setIsMenuOpen(false);
    };

    const inputClasses = `block w-full rounded-lg border px-3 py-2.5 text-sm transform transition-all duration-300 ease-out focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-white hover:border-cyan-500 hover:scale-[1.02] focus:ring-cyan-500 focus:border-cyan-500`;

    const navLinkClasses = (sectionId) => {
        const isActive = activeSection === sectionId;
        return `relative py-2 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 
                ${isActive ? 'text-cyan-600 dark:text-cyan-400' : ''}
                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-cyan-500 after:transition-transform after:duration-300 after:origin-left
                ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'} hover:after:scale-x-100`;
    };

    const mobileNavLinkClasses = (sectionId) => {
        const isActive = activeSection === sectionId;
        return `block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors
                ${isActive
                    ? 'bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`;
    };
    
    const getButtonClasses = (buttonType) => {
        const baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform transition-all duration-300";
        const isHovered = hoveredButton === buttonType;
        const isAnyHovered = hoveredButton !== null;

        if (buttonType === 'login') {
            if ((isHovered) || (!isAnyHovered && !hoveredButton)) {
                 return `${baseClasses} text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 hover:scale-105 hover:from-cyan-600 hover:to-blue-700`;
            }
            return `${baseClasses} text-slate-700 bg-slate-200 dark:text-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-105`;
        }
        if (buttonType === 'signup') {
            if ((isHovered) || (!isAnyHovered && !hoveredButton)) {
                return `${baseClasses} text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 hover:scale-105 hover:from-cyan-600 hover:to-blue-700`;
            }
             return `${baseClasses} text-slate-700 bg-slate-200 dark:text-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-105`;
        }
        return baseClasses;
    };
    
    const headerPrimaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform transition-all duration-300 text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 hover:scale-105 hover:from-cyan-600 hover:to-blue-700";
    const headerSecondaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transform transition-all duration-300 text-slate-700 bg-slate-200 dark:text-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-105";


    return (
        <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-700/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <LogoIcon />
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">ATS Analyzer</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <button onClick={() => scrollTo('features')} className={navLinkClasses('features')}>Features</button>
                            <button onClick={() => scrollTo('preview')} className={navLinkClasses('preview')}>Preview</button>
                            <button onClick={() => scrollTo('testimonials')} className={navLinkClasses('testimonials')}>Testimonials</button>
                            <button onClick={() => scrollTo('about')} className={navLinkClasses('about')}>About</button>
                            <button onClick={() => scrollTo('contact')} className={navLinkClasses('contact')}>Contact</button>
                        </nav>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="hidden md:flex items-center gap-2" onMouseLeave={() => setHoveredButton(null)}>
                                <button
                                    onClick={onLogin}
                                    onMouseEnter={() => setHoveredButton('login')}
                                    className={getButtonClasses('login')}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={onSignup}
                                    onMouseEnter={() => setHoveredButton('signup')}
                                    className={getButtonClasses('signup')}
                                >
                                    Sign Up
                                </button>
                            </div>
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(true)}
                                    type="button"
                                    className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-cyan-500"
                                    aria-controls="mobile-menu"
                                    aria-expanded={isMenuOpen}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <MenuIcon className="block h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div 
                    onClick={() => setIsMenuOpen(false)} 
                    className="absolute inset-0 bg-black/50"
                    aria-hidden="true"
                ></div>
                <div className={`relative flex flex-col w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
                    <div className="flex justify-between items-center p-4 border-b border-slate-200/80 dark:border-slate-700/80">
                        <div className="flex items-center gap-3">
                            <LogoIcon />
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">ATS Analyzer</span>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            type="button"
                            className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <span className="sr-only">Close menu</span>
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="flex-1 px-2 pt-4 pb-8 space-y-2 text-left">
                        <button onClick={() => scrollTo('features')} className={mobileNavLinkClasses('features')}>Features</button>
                        <button onClick={() => scrollTo('preview')} className={mobileNavLinkClasses('preview')}>Preview</button>
                        <button onClick={() => scrollTo('testimonials')} className={mobileNavLinkClasses('testimonials')}>Testimonials</button>
                        <button onClick={() => scrollTo('about')} className={mobileNavLinkClasses('about')}>About</button>
                        <button onClick={() => scrollTo('contact')} className={mobileNavLinkClasses('contact')}>Contact</button>
                    </nav>

                    <div className="p-4 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3">
                         <button
                            onClick={() => { onSignup(); setIsMenuOpen(false); }}
                            className={`w-full ${headerPrimaryButtonClasses} py-3 text-base`}
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => { onLogin(); setIsMenuOpen(false); }}
                            className={`w-full ${headerSecondaryButtonClasses} py-3 text-base`}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>

            <main>
                <section className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                                    Optimize Your Resume for <span className="text-cyan-500 dark:text-cyan-400">ATS in Seconds</span>
                                </h1>
                                <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto md:mx-0">
                                    Our AI analyzes your resume, scores it, and gives instant improvements to make you stand out and land more interviews.
                                </p>
                                <div className="mt-8 flex justify-center md:justify-start">
                                    <button 
                                        onClick={onGetStarted}
                                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform hover:scale-105 active:scale-100 transition-all duration-300"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>
                            <div className="mt-12 md:mt-0 transition-transform duration-500 ease-in-out hover:scale-105">
                               <HeroIllustration />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" ref={el => { if(el) sectionsRef.current['features'] = el; }} className="py-16 md:py-20 bg-slate-50/70 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                             <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">How It Works</h2>
                             <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Three simple steps to a better resume.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                           {features.map((feature, index) => (
                                <div 
                                    key={feature.title} 
                                    className={`transition-all duration-500 ease-out ${isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <FeatureCard {...feature} />
                                </div>
                           ))}
                        </div>
                    </div>
                </section>

                <section id="preview" ref={el => { if(el) sectionsRef.current['preview'] = el; }} className="py-16 md:py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center mb-12 transition-all duration-700 ease-out ${isVisible['preview'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                             <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Get Your Personalized Resume Score</h2>
                             <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Visualize your strengths and weaknesses at a glance.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 lg:p-12 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-lg">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                               <div className={`flex justify-center cursor-pointer transform transition-all duration-300 ease-out delay-200 hover:scale-105 ${isVisible['preview'] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                    <ScoreCircle score={8.2} isPreview={true} isVisible={isVisible['preview']} />
                               </div>
                               <div className="space-y-6">
                                    <div className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-out delay-300 hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:scale-105 transform ${isVisible['preview'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                        <div className="flex justify-between font-semibold mb-1"><p>Formatting</p><p>9/10</p></div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{width: isVisible['preview'] ? '90%' : '0%'}}></div></div>
                                    </div>
                                    <div className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-out delay-[450ms] hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:scale-105 transform ${isVisible['preview'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                        <div className="flex justify-between font-semibold mb-1"><p>Keyword Usage</p><p>7/10</p></div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{width: isVisible['preview'] ? '70%' : '0%'}}></div></div>
                                    </div>
                                    <div className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-out delay-[600ms] hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:scale-105 transform ${isVisible['preview'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                        <div className="flex justify-between font-semibold mb-1"><p>Quantified Results</p><p>5/10</p></div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{width: isVisible['preview'] ? '50%' : '0%'}}></div></div>
                                    </div>
                               </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="insights" ref={el => { if(el) sectionsRef.current['insights'] = el; }} className="py-16 md:py-20 bg-slate-50/70 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className={`text-center mb-12 transition-all duration-700 ease-out ${isVisible['insights'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                             <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Personalized Insights</h2>
                             <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Clear strengths and targeted improvements to focus your efforts.</p>
                        </div>
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className={`transition-all duration-500 ease-out ${isVisible['insights'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `0ms` }}>
                                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg h-full border border-slate-200/80 dark:border-slate-700 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1 cursor-pointer">
                                    <h4 className="flex items-center text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
                                        <ThumbsUpIcon className="w-6 h-6 mr-2 text-green-500" />
                                        Top Strengths
                                    </h4>
                                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Clear, concise summary section.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Excellent use of action verbs.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={`transition-all duration-500 ease-out ${isVisible['insights'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `150ms` }}>
                                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg h-full border border-slate-200/80 dark:border-slate-700 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1 cursor-pointer">
                                    <h4 className="flex items-center text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
                                        <ZapIcon className="w-6 h-6 mr-2 text-red-500" />
                                        Main Improvements
                                    </h4>
                                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <XIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span>Lack of quantifiable achievements.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <XIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span>Missing keywords from job description.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section id="keywords" className="py-16 md:py-20">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                             <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Incorporate Recommended Keywords</h2>
                             <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Boost your score by including these crucial terms found in the job description.</p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-wrap justify-center gap-4">
                                <KeywordTag>Project Management</KeywordTag>
                                <KeywordTag>Agile Methodologies</KeywordTag>
                                <KeywordTag>Stakeholder Communication</KeywordTag>
                                <KeywordTag>Budgeting & Forecasting</KeywordTag>
                                <KeywordTag>Risk Analysis</KeywordTag>
                                <KeywordTag>Scrum</KeywordTag>
                                <KeywordTag>JIRA</KeywordTag>
                            </div>
                        </div>
                     </div>
                </section>
                
                <section id="testimonials" ref={el => { if(el) sectionsRef.current['testimonials'] = el; }} className="py-16 md:py-20 bg-slate-50/70 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Trusted by Professionals</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">See how our users have landed their dream jobs.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={testimonial.name}
                                    className={`transition-all duration-500 ease-out ${isVisible['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section id="about" className="py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Our Mission</h2>
                                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                                    The modern job market is more competitive than ever. We believe that talented individuals shouldn't be overlooked because of resume formatting or keyword mismatches. Our mission is to level the playing field by providing powerful, AI-driven tools that empower job seekers to put their best foot forward.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    <li className="flex items-start gap-3"><CheckIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" /><span><strong>Empowerment Through Technology:</strong> Leveraging cutting-edge AI to provide actionable insights.</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" /><span><strong>Simplifying the Job Hunt:</strong> Making resume optimization straightforward and accessible to everyone.</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" /><span><strong>Boosting Confidence:</strong> Helping you apply for jobs with the assurance that your resume is truly competitive.</span></li>
                                </ul>
                            </div>
                            <div className="order-1 md:order-2 transition-transform duration-500 ease-in-out hover:scale-105">
                                <MissionIllustration />
                            </div>
                        </div>
                    </div>
                </section>
                
                <section id="contact" className="py-16 md:py-20 bg-slate-50/70 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Get in Touch</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Have questions or feedback? We'd love to hear from you.</p>
                        </div>
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-lg">
                           <div className="rounded-lg overflow-hidden group">
                                <div className="transition-transform duration-500 ease-in-out group-hover:scale-110">
                                    <ContactIllustration />
                                </div>
                            </div>
                            <div>
                               {contactStatus === 'success' ? (
                                    <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Thank you!</h3>
                                        <p className="text-green-600 dark:text-green-400 mt-2">Your message has been sent successfully. We'll get back to you soon.</p>
                                    </div>
                                ) : (
                                   <form className="space-y-6" onSubmit={handleContactSubmit}>
                                       <div className="grid sm:grid-cols-2 gap-4">
                                           <div>
                                               <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Full Name</label>
                                               <input type="text" name="name" id="name" required className={inputClasses} placeholder="Your Name" />
                                           </div>
                                           <div>
                                               <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email Address</label>
                                               <input type="email" name="email" id="email" required className={inputClasses} placeholder="you@example.com" />
                                           </div>
                                           <div className="sm:col-span-2">
                                               <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Message</label>
                                               <textarea name="message" id="message" rows={4} required className={inputClasses} placeholder="Your message..."></textarea>
                                           </div>
                                       </div>
                                       <div>
                                           <button type="submit" disabled={contactStatus === 'submitting'} className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/20 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform hover:scale-105 transition-all duration-300 focus:ring-offset-white dark:focus:ring-offset-slate-800 disabled:opacity-70 disabled:cursor-not-allowed`}>
                                               {contactStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                                           </button>
                                       </div>
                                   </form>
                               )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-800 dark:bg-slate-900/80">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <h2 className="text-3xl font-extrabold text-slate-100">Ready to Land Your Dream Job?</h2>
                        <p className="mt-4 text-lg text-slate-300">Stop guessing. Start getting interviews. Analyze your resume for free today.</p>
                        <div className="mt-8">
                            <button
                                onClick={onGetStarted}
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transform hover:scale-105 active:scale-100 transition-all duration-300"
                            >
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Product</h3>
                            <ul className="mt-4 space-y-3">
                                {/* FIX: Add type="button" to buttons to prevent unintended form submissions and resolve potential typing issues. */}
                                <li><button type="button" onClick={() => scrollTo('features')} className="text-sm hover:text-white transition-colors">Features</button></li>
                                <li><button type="button" className="text-sm hover:text-white transition-colors">Pricing</button></li>
                                <li><button type="button" className="text-sm hover:text-white transition-colors">Documentation</button></li>
                            </ul>
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Resources</h3>
                            <ul className="mt-4 space-y-3">
                                <li><button type="button" className="text-sm hover:text-white transition-colors">Blog</button></li>
                                <li><button type="button" className="text-sm hover:text-white transition-colors">FAQs</button></li>
                                <li><button type="button" onClick={() => scrollTo('contact')} className="text-sm hover:text-white transition-colors">Contact Us</button></li>
                            </ul>
                        </div>
                         <div>
                           <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-3">
                                <li><button type="button" onClick={() => scrollTo('about')} className="text-sm hover:text-white transition-colors">About Us</button></li>
                                <li><button type="button" className="text-sm hover:text-white transition-colors">Careers</button></li>
                            </ul>
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                <li><button type="button" className="text-sm hover:text-white transition-colors">Privacy Policy</button></li>
                                <li><button type="button" className="text-sm hover:text-white transition-colors">Terms of Service</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col items-center">
                        <div className="flex space-x-6 mb-4">
                           <a href="#" aria-label="Twitter" className="hover:text-cyan-400 transform hover:scale-110 transition-all duration-200"><TwitterIcon /></a>
                           <a href="#" aria-label="GitHub" className="hover:text-cyan-400 transform hover:scale-110 transition-all duration-200"><GithubIcon /></a>
                           <a href="#" aria-label="LinkedIn" className="hover:text-cyan-400 transform hover:scale-110 transition-all duration-200"><LinkedinIcon /></a>
                        </div>
                        <p className="text-sm text-center">&copy; {new Date().getFullYear()} ATS Analyzer. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            
            {showBackToTop && !isMenuOpen && (
                <button
                    onClick={scrollTop}
                    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 p-3 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-600 transition-all duration-300 animate-bounce"
                    aria-label="Go to top"
                >
                    <ArrowUpIcon className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default LandingPage;