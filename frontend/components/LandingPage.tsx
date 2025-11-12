import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, ZapIcon, BarChartIcon, TagsIcon, ThumbsUpIcon, LightbulbIcon, CheckBadgeIcon, CheckIcon, XIcon, SparklesIcon, LinkedinIcon, GithubIcon, TwitterIcon, MenuIcon, StarIcon, ArrowUpIcon } from './icons';
import { HeroIllustration, MissionIllustration } from './Illustrations';

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
    onSignup: () => void;
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
        avatar: "https://picsum.photos/seed/woman1/48/48"
    },
    {
        quote: "I couldn't figure out why my resume wasn't getting past the initial screening. The keyword suggestions were exactly what I needed.",
        name: "Michael B.",
        role: "Marketing Manager",
        avatar: "https://picsum.photos/seed/man1/48/48"
    },
    {
        quote: "As a recent graduate, this tool gave me the confidence to apply for competitive roles. The feedback is clear, concise, and incredibly helpful.",
        name: "Emily C.",
        role: "UX/UI Designer",
        avatar: "https://picsum.photos/seed/woman2/48/48"
    },
    {
        quote: "The detailed performance metrics helped me target exactly which parts of my resume to improve. I saw a noticeable increase in responses from recruiters.",
        name: "David L.",
        role: "Data Analyst",
        avatar: "https://picsum.photos/seed/man2/48/48"
    }
];


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 hover:border-cyan-200 dark:hover:border-cyan-600 transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
);

const KeywordTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-cyan-50 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 border border-cyan-200/80 dark:border-cyan-700/50 shadow-sm transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-cyan-400/20 hover:text-cyan-700 dark:hover:text-cyan-100">
        <SparklesIcon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
        {children}
    </span>
);

const ScoreCircle: React.FC<{ score: number; isPreview?: boolean; isVisible?: boolean }> = ({ score, isPreview, isVisible }) => {
  const radius = isPreview ? 72 : 56;
  const strokeWidth = isPreview ? 16 : 12;
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

  const size = isPreview ? 'w-48 h-48' : 'w-40 h-40';
  const scoreSize = isPreview ? 'text-6xl' : 'text-5xl';
  const scoreSubSize = isPreview ? 'text-2xl' : 'text-xl';
  
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          className={"stroke-slate-200 dark:stroke-slate-700"}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={`stroke-cyan-500 dark:stroke-cyan-400 transition-stroke-dashoffset duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className={`text-center transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`${scoreSize} font-bold text-cyan-500 dark:text-cyan-400`}>{score.toFixed(1)}</span>
        <span className={`${scoreSubSize} text-slate-500 dark:text-slate-400`}>/10</span>
      </div>
    </div>
  );
};

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; avatar: string }> = ({ quote, name, role, avatar }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200/80 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 hover:-translate-y-1 h-full">
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
        <p className="text-slate-600 dark:text-slate-400 italic">"{quote}"</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onSignup }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    // Fix: Correctly use React hooks for scroll animations.
    // Refs should be defined at the top level of the component, not inside an object literal.
    const featuresRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLElement>(null);
    const testimonialsRef = useRef<HTMLDivElement>(null);

    // State should only contain the visibility status, not the refs.
    const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({
        features: false,
        preview: false,
        testimonials: false,
    });

    useEffect(() => {
        const sectionsToObserve = [
            { id: 'features', ref: featuresRef },
            { id: 'preview', ref: previewRef },
            { id: 'testimonials', ref: testimonialsRef },
        ];
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        sectionsToObserve.forEach(section => {
            if (section.ref.current) {
                observer.observe(section.ref.current);
            }
        });
        
        return () => observer.disconnect();
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
        
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '-50% 0px -50% 0px', // Trigger when the section is in the middle of the viewport
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

    const scrollTo = (id: string) => {
        const targetElement = document.getElementById(id);
        if (!targetElement) return;

        const headerOffset = 64; // Corresponds to h-16 in Tailwind
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
        setIsMenuOpen(false);
    };

    const inputClasses = `block w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-white border-slate-300 placeholder-slate-500 text-slate-800 hover:border-cyan-500 focus:ring-cyan-500 focus:border-cyan-500`;

    const navLinkClasses = (sectionId: string) => {
        const isActive = activeSection === sectionId;
        return `relative py-2 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 
                ${isActive ? 'text-cyan-600 dark:text-cyan-400' : ''}
                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-cyan-500 after:transition-transform after:duration-300 after:origin-left
                ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'} hover:after:scale-x-100`;
    };

    const mobileNavLinkClasses = (sectionId: string) => {
        const isActive = activeSection === sectionId;
        return `block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors
                ${isActive
                    ? 'bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`;
    };
    
    const headerPrimaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform transition-all duration-300 text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 dark:shadow-cyan-400/20 hover:scale-105 hover:from-cyan-600 hover:to-blue-700";
    const headerSecondaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transform transition-all duration-300 text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105";


    return (
        <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
            {/* Header */}
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
                            <div className="hidden md:flex items-center gap-2">
                                <button onClick={onLogin} className={headerSecondaryButtonClasses}>Login</button>
                                <button onClick={onSignup} className={headerPrimaryButtonClasses}>Sign Up</button>
                            </div>
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(true)}
                                    type="button"
                                    className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-cyan-500"
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

            {/* Mobile Menu */}
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
                            className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                                    Optimize Your Resume for <span className="text-cyan-500 dark:text-cyan-400">ATS in Seconds</span>
                                </h1>
                                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
                                    Our AI analyzes your resume, scores it, and gives instant improvements to make you stand out and land more interviews.
                                </p>
                                <div className="mt-8 flex justify-center md:justify-start">
                                    <button 
                                        onClick={onGetStarted}
                                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/20 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform hover:scale-105 transition-all duration-300"
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

                {/* Features Section */}
                <section id="features" ref={featuresRef} className="py-20 bg-slate-50/70 dark:bg-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                             <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">How It Works</h2>
                             <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Three simple steps to a better resume.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                           {features.map((feature, index) => (
                                <div 
                                    key={feature.title} 
                                    className={`transition-all duration-500 ease-out ${visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <FeatureCard {...feature} />
                                </div>
                           ))}
                        </div>
                    </div>
                </section>

                {/* Results Preview Section */}
                <section ref={previewRef} id="preview" className="py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 lg:p-12 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-lg">
                            <div className={`text-center mb-12 transition-all duration-700 ease-out ${visibleSections.preview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                 <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Get Your Personalized Resume Score</h2>
                                 <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Visualize your strengths and weaknesses at a glance.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                               <div className={`flex justify-center cursor-pointer transform transition-all duration-300 ease-out delay-200 hover:scale-105 ${visibleSections.preview ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                    <ScoreCircle score={8.2} isPreview={true} isVisible={visibleSections.preview} />
                               </div>
                               <div className="space-y-6">
                                    <div className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-out delay-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105 transform ${visibleSections.preview ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                        <div className="flex justify-between font-semibold mb-1"><p>Formatting</p><p>9/10</p></div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{width: visibleSections.preview ? '90%' : '0%'}}></div></div>
                                    </div>
                                    <div className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-out delay-[450ms] hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105 transform ${visibleSections.preview ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                        <div className="flex justify-between font-semibold mb-1"><p>Keyword Usage</p><p>7/10</p></div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{width: visibleSections.preview ? '70%' : '0%'}}></div></div>
                                    </div>
                                    <div className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-out delay-[600ms] hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105 transform ${visibleSections.preview ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                        <div className="flex justify-between font-semibold mb-1"><p>Quantified Results</p><p>5/10</p></div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-orange-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{width: visibleSections.preview ? '50%' : '0%'}}></div></div>
                                    </div>
                               </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Strengths & Improvements */}
                <section className="py-20 bg-slate-50/70 dark:bg-slate-800/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
                         <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 hover:border-cyan-200 dark:hover:border-cyan-600 transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-3 mb-4"><div className="text-green-500"><ThumbsUpIcon /></div><h3 className="text-xl font-bold dark:text-slate-100">Top Strengths</h3></div>
                            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-2 items-start"><CheckIcon className="w-5 h-5 text-green-500 mt-0.5" /><span>Clear, concise summary section.</span></li>
                                <li className="flex gap-2 items-start"><CheckIcon className="w-5 h-5 text-green-500 mt-0.5" /><span>Excellent use of action verbs.</span></li>
                            </ul>
                         </div>
                         <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 hover:border-cyan-200 dark:hover:border-cyan-600 transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-3 mb-4"><div className="text-red-500"><ZapIcon /></div><h3 className="text-xl font-bold dark:text-slate-100">Main Improvements</h3></div>
                            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-2 items-start"><XIcon className="w-5 h-5 text-red-500 mt-0.5" /><span>Lack of quantifiable achievements.</span></li>
                                <li className="flex gap-2 items-start"><XIcon className="w-5 h-5 text-red-500 mt-0.5" /><span>Missing keywords from job description.</span></li>
                            </ul>
                         </div>
                    </div>
                </section>

                {/* Keywords Section */}
                <section id="keywords" className="py-20">
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
                
                {/* Testimonials Section */}
                <section id="testimonials" ref={testimonialsRef} className="py-20 bg-slate-50/70 dark:bg-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Trusted by Professionals</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">See how our users have landed their dream jobs.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={testimonial.name}
                                    className={`transition-all duration-500 ease-out ${visibleSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* About Us Section */}
                <section id="about" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Our Mission</h2>
                                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                                    The modern job market is more competitive than ever. We believe that talented individuals shouldn't be overlooked because of resume formatting or keyword mismatches. Our mission is to level the playing field by providing powerful, AI-driven tools that empower job seekers to put their best foot forward.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    <li className="flex items-start gap-3"><CheckIcon className="w-6 h-6 text-cyan-500 mt-0.5 flex-shrink-0" /><span><strong>Empowerment Through Technology:</strong> Leveraging cutting-edge AI to provide actionable insights.</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon className="w-6 h-6 text-cyan-500 mt-0.5 flex-shrink-0" /><span><strong>Simplifying the Job Hunt:</strong> Making resume optimization straightforward and accessible to everyone.</span></li>
                                    <li className="flex items-start gap-3"><CheckIcon className="w-6 h-6 text-cyan-500 mt-0.5 flex-shrink-0" /><span><strong>Boosting Confidence:</strong> Helping you apply for jobs with the assurance that your resume is truly competitive.</span></li>
                                </ul>
                            </div>
                            <div className="order-1 md:order-2 transition-transform duration-500 ease-in-out hover:scale-105">
                                <MissionIllustration />
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Contact Us Section */}
                <section id="contact" className="py-20 bg-slate-50/70 dark:bg-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">Get in Touch</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Have questions or feedback? We'd love to hear from you.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                             <div>
                                <img src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=1974&auto=format&fit=crop" alt="Friendly customer support person on a call" className="rounded-lg shadow-xl aspect-[4/3] w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105" />
                             </div>
                             <div className="bg-white dark:bg-slate-800/50 p-8 rounded-lg border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <form className="space-y-4">
                                    <div className="transition-transform duration-300 ease-in-out hover:scale-105">
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Full Name</label>
                                        <input type="text" name="name" id="name" required className={inputClasses} placeholder="Your Name" />
                                    </div>
                                    <div className="transition-transform duration-300 ease-in-out hover:scale-105">
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Email Address</label>
                                        <input type="email" name="email" id="email" required className={inputClasses} placeholder="you@example.com" />
                                    </div>
                                    <div className="transition-transform duration-300 ease-in-out hover:scale-105">
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Message</label>
                                        <textarea name="message" id="message" rows={4} required className={inputClasses} placeholder="Your message..."></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/20 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform hover:scale-105 transition-all duration-300 focus:ring-offset-white`}>Send Message</button>
                                    </div>
                                </form>
                             </div>
                        </div>
                    </div>
                </section>


                 {/* CTA Section */}
                <section className="bg-slate-900 dark:bg-slate-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <h2 className="text-3xl font-extrabold text-slate-100">Ready to Land Your Dream Job?</h2>
                        <p className="mt-4 text-lg text-slate-300">Stop guessing. Start getting interviews. Analyze your resume for free today.</p>
                        <div className="mt-8">
                            <button
                                onClick={onGetStarted}
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/20 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 dark:focus:ring-offset-slate-800 focus:ring-cyan-500 transform hover:scale-105 transition-all duration-300"
                            >
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-black/20 text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Product</h3>
                            <ul className="mt-4 space-y-3">
                                <li><button onClick={() => scrollTo('features')} className="text-sm hover:text-white transition-colors">Features</button></li>
                                <li><button className="text-sm hover:text-white transition-colors">Pricing</button></li>
                                <li><button className="text-sm hover:text-white transition-colors">Documentation</button></li>
                            </ul>
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Resources</h3>
                            <ul className="mt-4 space-y-3">
                                <li><button className="text-sm hover:text-white transition-colors">Blog</button></li>
                                <li><button className="text-sm hover:text-white transition-colors">FAQs</button></li>
                                <li><button onClick={() => scrollTo('contact')} className="text-sm hover:text-white transition-colors">Contact Us</button></li>
                            </ul>
                        </div>
                         <div>
                           <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-3">
                                <li><button onClick={() => scrollTo('about')} className="text-sm hover:text-white transition-colors">About Us</button></li>
                                <li><button className="text-sm hover:text-white transition-colors">Careers</button></li>
                            </ul>
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                <li><button className="text-sm hover:text-white transition-colors">Privacy Policy</button></li>
                                <li><button className="text-sm hover:text-white transition-colors">Terms of Service</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-slate-800 dark:border-slate-700 pt-8 flex flex-col items-center">
                        <div className="flex space-x-6 mb-4">
                           <a href="#" aria-label="Twitter" className="hover:text-cyan-400 transform hover:scale-110 transition-all duration-200"><TwitterIcon /></a>
                           <a href="#" aria-label="GitHub" className="hover:text-cyan-400 transform hover:scale-110 transition-all duration-200"><GithubIcon /></a>
                           <a href="#" aria-label="LinkedIn" className="hover:text-cyan-400 transform hover:scale-110 transition-all duration-200"><LinkedinIcon /></a>
                        </div>
                        <p className="text-sm text-center">&copy; {new Date().getFullYear()} ATS Analyzer. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;