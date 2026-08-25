import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Home, Calendar, Flame, RefreshCw, History as HistoryIcon, BarChart3,
  CheckCircle2, Circle, Clock, AlertTriangle, ChevronRight, ChevronDown,
  BookOpen, Target, TrendingUp, X, Plus, MoreHorizontal, ArrowLeft, FileText,
  Search, Upload, Zap, FlaskConical, Dna, Settings
} from "lucide-react";
import { loadBlob, saveBlob } from "./storage";
import { supabase } from "./supabaseClient";

/* ============================================================
   NEET 2027 COMMAND CENTER — Module 1 (Core Engine)
   Data source: Yakeen NEET 2.0 2027 official lecture planners
   (Physics, Physical Chemistry, Organic Chemistry, Inorganic
   Chemistry, Zoology, Botany). No fabricated planner data.

   Module 1 scope: schema wiring, permanent task IDs, backlog
   scheduling engine, live-class matching, missed-live records,
   unified carry-forward, subject-wise study hours, full history
   log, Dashboard, Today, Backlog pages.

   Coming in later modules: NCERT 8-round tracker, Revision 5x,
   PYQ 37-year tracker, Mistake Book, Test Analysis.
   ============================================================ */

const PLANNER = [{"id":"PHY-001","s":"Physics","c":"Basic Maths & Calculus","t":"Trigonometry","l":1,"d":"2026-06-29","tc":"Manish Raj Sir"},{"id":"PHY-002","s":"Physics","c":"Basic Maths & Calculus","t":"Trigonometry","l":2,"d":"2026-06-30","tc":"Manish Raj Sir"},{"id":"PHY-003","s":"Physics","c":"Basic Maths & Calculus","t":"Algebra","l":3,"d":"2026-07-01","tc":"Manish Raj Sir"},{"id":"PHY-004","s":"Physics","c":"Basic Maths & Calculus","t":"Binomial","l":4,"d":"2026-07-02","tc":"Manish Raj Sir"},{"id":"PHY-005","s":"Physics","c":"Basic Maths & Calculus","t":"AP GP","l":5,"d":"2026-07-03","tc":"Manish Raj Sir"},{"id":"PHY-006","s":"Physics","c":"Basic Maths & Calculus","t":"Graphs","l":6,"d":"2026-07-04","tc":"Manish Raj Sir"},{"id":"PHY-007","s":"Physics","c":"Basic Maths & Calculus","t":"Logarithms","l":7,"d":"2026-07-06","tc":"Manish Raj Sir"},{"id":"PHY-008","s":"Physics","c":"Basic Maths & Calculus","t":"Coordinate Geometry","l":8,"d":"2026-07-07","tc":"Manish Raj Sir"},{"id":"PHY-009","s":"Physics","c":"Basic Maths & Calculus","t":"Coordinate Geometry","l":9,"d":"2026-07-08","tc":"Manish Raj Sir"},{"id":"PHY-010","s":"Physics","c":"Basic Maths & Calculus","t":"Differentiation","l":10,"d":"2026-07-09","tc":"Manish Raj Sir"},{"id":"PHY-011","s":"Physics","c":"Basic Maths & Calculus","t":"Question Practice","l":11,"d":"2026-07-10","tc":"Manish Raj Sir"},{"id":"PHY-012","s":"Physics","c":"Vectors","t":"Intro of vector and scalar; Types of vectors","l":1,"d":"2026-07-11","tc":"Manish Raj Sir"},{"id":"PHY-013","s":"Physics","c":"Vectors","t":"Vector addition","l":2,"d":"2026-07-13","tc":"Manish Raj Sir"},{"id":"PHY-014","s":"Physics","c":"Vectors","t":"Vector subtraction","l":3,"d":"2026-07-14","tc":"Manish Raj Sir"},{"id":"PHY-015","s":"Physics","c":"Vectors","t":"Resolution of vectors; Multiplication by scalar","l":4,"d":"2026-07-15","tc":"Manish Raj Sir"},{"id":"PHY-016","s":"Physics","c":"Vectors","t":"Scalar product; Vector product; Vector Projection","l":5,"d":"2026-07-16","tc":"Manish Raj Sir"},{"id":"PHY-017","s":"Physics","c":"Vectors","t":"Vector product","l":6,"d":"2026-07-17","tc":"Manish Raj Sir"},{"id":"PHY-018","s":"Physics","c":"Vectors","t":"Question Practice","l":7,"d":"2026-07-18","tc":"Manish Raj Sir"},{"id":"PHY-019","s":"Physics","c":"Units and Measurements","t":"Physical Quantities and Units","l":1,"d":"2026-07-20","tc":"Manish Raj Sir"},{"id":"PHY-020","s":"Physics","c":"Units and Measurements","t":"Dimensions and Dimensional formula","l":2,"d":"2026-07-21","tc":"Manish Raj Sir"},{"id":"PHY-021","s":"Physics","c":"Units and Measurements","t":"Dimensional Analysis","l":3,"d":"2026-07-22","tc":"Manish Raj Sir"},{"id":"PHY-022","s":"Physics","c":"Units and Measurements","t":"Dimensional Analysis","l":4,"d":"2026-07-23","tc":"Manish Raj Sir"},{"id":"PHY-023","s":"Physics","c":"Units and Measurements","t":"Dimensional Analysis","l":5,"d":"2026-07-24","tc":"Manish Raj Sir"},{"id":"PHY-024","s":"Physics","c":"Units and Measurements","t":"Significant Figures","l":6,"d":"2026-07-25","tc":"Manish Raj Sir"},{"id":"PHY-025","s":"Physics","c":"Units and Measurements","t":"Errors in Measurement","l":7,"d":"2026-07-27","tc":"Manish Raj Sir"},{"id":"PHY-026","s":"Physics","c":"Units and Measurements","t":"Errors in Measurement","l":8,"d":"2026-07-28","tc":"Manish Raj Sir"},{"id":"PHY-027","s":"Physics","c":"Units and Measurements","t":"Measuring Instruments","l":9,"d":"2026-07-29","tc":"Manish Raj Sir"},{"id":"PHY-028","s":"Physics","c":"Units and Measurements","t":"Question Practice","l":10,"d":"2026-07-30","tc":"Manish Raj Sir"},{"id":"PHY-029","s":"Physics","c":"Motion in a straight line","t":"Intro of mechanics; frame of reference; distance/displacement","l":1,"d":"2026-07-31","tc":"Manish Raj Sir"},{"id":"PHY-030","s":"Physics","c":"Motion in a straight line","t":"Average speed and average velocity","l":2,"d":"2026-08-01","tc":"Manish Raj Sir"},{"id":"PHY-031","s":"Physics","c":"Motion in a straight line","t":"Instantaneous velocity and speed","l":3,"d":"2026-08-03","tc":"Manish Raj Sir"},{"id":"PHY-032","s":"Physics","c":"Motion in a straight line","t":"Acceleration","l":4,"d":"2026-08-04","tc":"Manish Raj Sir"},{"id":"PHY-033","s":"Physics","c":"Motion in a straight line","t":"Uniform motion; Uniform acceleration","l":5,"d":"2026-08-05","tc":"Manish Raj Sir"},{"id":"PHY-034","s":"Physics","c":"Motion in a straight line","t":"Motion under gravity (Free fall)","l":6,"d":"2026-08-06","tc":"Manish Raj Sir"},{"id":"PHY-035","s":"Physics","c":"Motion in a straight line","t":"Motion under gravity (Free fall)","l":7,"d":"2026-08-07","tc":"Manish Raj Sir"},{"id":"PHY-036","s":"Physics","c":"Motion in a straight line","t":"Graph of 1D motion","l":8,"d":"2026-08-08","tc":"Manish Raj Sir"},{"id":"PHY-037","s":"Physics","c":"Motion in a straight line","t":"Graph of 1D motion","l":9,"d":"2026-08-10","tc":"Manish Raj Sir"},{"id":"PHY-038","s":"Physics","c":"Motion in a straight line","t":"Variable acceleration","l":10,"d":"2026-08-11","tc":"Manish Raj Sir"},{"id":"PHY-039","s":"Physics","c":"Motion in a straight line","t":"Variable acceleration","l":11,"d":"2026-08-12","tc":"Manish Raj Sir"},{"id":"PHY-040","s":"Physics","c":"Motion in a straight line","t":"Graph of 1D motion","l":12,"d":"2026-08-13","tc":"Manish Raj Sir"},{"id":"PHY-041","s":"Physics","c":"Motion in a straight line","t":"Graph of 1D motion","l":13,"d":"2026-08-14","tc":"Manish Raj Sir"},{"id":"PHY-042","s":"Physics","c":"Motion in a straight line","t":"Question Practice","l":14,"d":"2026-08-17","tc":"Manish Raj Sir"},{"id":"PHY-043","s":"Physics","c":"Motion in a plane","t":"Projectile motion","l":1,"d":"2026-08-18","tc":"Manish Raj Sir"},{"id":"PHY-044","s":"Physics","c":"Motion in a plane","t":"Projectile motion","l":2,"d":"2026-08-19","tc":"Manish Raj Sir"},{"id":"PHY-045","s":"Physics","c":"Motion in a plane","t":"Projectile motion","l":3,"d":"2026-08-20","tc":"Manish Raj Sir"},{"id":"PHY-046","s":"Physics","c":"Motion in a plane","t":"Projectile motion","l":4,"d":"2026-08-21","tc":"Manish Raj Sir"},{"id":"PHY-047","s":"Physics","c":"Motion in a plane","t":"Relative motion","l":5,"d":"2026-08-22","tc":"Manish Raj Sir"},{"id":"PHY-048","s":"Physics","c":"Motion in a plane","t":"Circular motion-1","l":6,"d":"2026-08-24","tc":"Manish Raj Sir"},{"id":"PHY-049","s":"Physics","c":"Motion in a plane","t":"Question Practice","l":7,"d":"2026-08-25","tc":"Manish Raj Sir"},{"id":"PHY-050","s":"Physics","c":"Laws of motion","t":"Force; Newton's first law","l":1,"d":"2026-08-26","tc":"Manish Raj Sir"},{"id":"PHY-051","s":"Physics","c":"Laws of motion","t":"Linear momentum","l":2,"d":"2026-08-27","tc":"Manish Raj Sir"},{"id":"PHY-052","s":"Physics","c":"Laws of motion","t":"Newton's second law","l":3,"d":"2026-08-29","tc":"Manish Raj Sir"},{"id":"PHY-053","s":"Physics","c":"Laws of motion","t":"Newton's third law; Free body diagram","l":4,"d":"2026-08-31","tc":"Manish Raj Sir"},{"id":"PHY-054","s":"Physics","c":"Laws of motion","t":"Working with Newton's first law","l":5,"d":"2026-09-01","tc":"Manish Raj Sir"},{"id":"PHY-055","s":"Physics","c":"Laws of motion","t":"Working with Newton's second law","l":6,"d":"2026-09-02","tc":"Manish Raj Sir"},{"id":"PHY-056","s":"Physics","c":"Laws of motion","t":"Calculation of acceleration","l":7,"d":"2026-09-03","tc":"Manish Raj Sir"},{"id":"PHY-057","s":"Physics","c":"Laws of motion","t":"Spring force; Frame of reference; Rocket propulsion","l":8,"d":"2026-09-04","tc":"Manish Raj Sir"},{"id":"PHY-058","s":"Physics","c":"Laws of motion","t":"Friction; Types of friction","l":9,"d":"2026-09-05","tc":"Manish Raj Sir"},{"id":"PHY-059","s":"Physics","c":"Laws of motion","t":"Graph between applied force and friction","l":10,"d":"2026-09-07","tc":"Manish Raj Sir"},{"id":"PHY-060","s":"Physics","c":"Laws of motion","t":"Angle of friction and repose","l":11,"d":"2026-09-08","tc":"Manish Raj Sir"},{"id":"PHY-061","s":"Physics","c":"Laws of motion","t":"Acceleration on rough surface","l":12,"d":"2026-09-09","tc":"Manish Raj Sir"},{"id":"PHY-062","s":"Physics","c":"Laws of motion","t":"Dynamics of circular motion","l":13,"d":"2026-09-10","tc":"Manish Raj Sir"},{"id":"PHY-063","s":"Physics","c":"Laws of motion","t":"Dynamics of circular motion","l":14,"d":"2026-09-11","tc":"Manish Raj Sir"},{"id":"PHY-064","s":"Physics","c":"Laws of motion","t":"Dynamics of circular motion","l":15,"d":"2026-09-12","tc":"Manish Raj Sir"},{"id":"PHY-065","s":"Physics","c":"Laws of motion","t":"Question Practice","l":16,"d":"2026-09-15","tc":"Manish Raj Sir"},{"id":"PHY-066","s":"Physics","c":"Work energy and power","t":"Work","l":1,"d":"2026-09-16","tc":"Manish Raj Sir"},{"id":"PHY-067","s":"Physics","c":"Work energy and power","t":"Energy","l":2,"d":"2026-09-17","tc":"Manish Raj Sir"},{"id":"PHY-068","s":"Physics","c":"Work energy and power","t":"Work energy theorem","l":3,"d":"2026-09-18","tc":"Manish Raj Sir"},{"id":"PHY-069","s":"Physics","c":"Work energy and power","t":"Conservative and non-conservative force","l":4,"d":"2026-09-19","tc":"Manish Raj Sir"},{"id":"PHY-070","s":"Physics","c":"Work energy and power","t":"Potential energy","l":5,"d":"2026-09-21","tc":"Manish Raj Sir"},{"id":"PHY-071","s":"Physics","c":"Work energy and power","t":"Potential energy","l":6,"d":"2026-09-22","tc":"Manish Raj Sir"},{"id":"PHY-072","s":"Physics","c":"Work energy and power","t":"Equilibrium","l":7,"d":"2026-09-23","tc":"Manish Raj Sir"},{"id":"PHY-073","s":"Physics","c":"Work energy and power","t":"Question Practice","l":8,"d":"2026-09-24","tc":"Manish Raj Sir"},{"id":"PHY-074","s":"Physics","c":"Centre of mass and System of Particles","t":"Centre of mass","l":1,"d":"2026-09-25","tc":"Manish Raj Sir"},{"id":"PHY-075","s":"Physics","c":"Centre of mass and System of Particles","t":"Centre of mass","l":2,"d":"2026-09-26","tc":"Manish Raj Sir"},{"id":"PHY-076","s":"Physics","c":"Centre of mass and System of Particles","t":"Collision; head-on collision","l":3,"d":"2026-09-28","tc":"Manish Raj Sir"},{"id":"PHY-077","s":"Physics","c":"Centre of mass and System of Particles","t":"Collision; head-on collision","l":4,"d":"2026-09-29","tc":"Manish Raj Sir"},{"id":"PHY-078","s":"Physics","c":"Centre of mass and System of Particles","t":"Collision; head-on collision","l":5,"d":"2026-09-30","tc":"Manish Raj Sir"},{"id":"PHY-079","s":"Physics","c":"Centre of mass and System of Particles","t":"Collision; head-on collision","l":6,"d":"2026-10-01","tc":"Manish Raj Sir"},{"id":"PHY-080","s":"Physics","c":"Centre of mass and System of Particles","t":"Question Practice","l":7,"d":"2026-10-03","tc":"Manish Raj Sir"},{"id":"PHY-081","s":"Physics","c":"Rotational Motion","t":"Introduction; rigid body","l":1,"d":"2026-10-05","tc":"Manish Raj Sir"},{"id":"PHY-082","s":"Physics","c":"Rotational Motion","t":"Moment of inertia","l":2,"d":"2026-10-06","tc":"Manish Raj Sir"},{"id":"PHY-083","s":"Physics","c":"Rotational Motion","t":"Moment of inertia","l":3,"d":"2026-10-07","tc":"Manish Raj Sir"},{"id":"PHY-084","s":"Physics","c":"Rotational Motion","t":"Theorems of moment of inertia","l":4,"d":"2026-10-08","tc":"Manish Raj Sir"},{"id":"PHY-085","s":"Physics","c":"Rotational Motion","t":"Radius of gyration; torque; Newton's laws for rotation","l":5,"d":"2026-10-09","tc":"Manish Raj Sir"},{"id":"PHY-086","s":"Physics","c":"Rotational Motion","t":"Angular momentum","l":6,"d":"2026-10-10","tc":"Manish Raj Sir"},{"id":"PHY-087","s":"Physics","c":"Rotational Motion","t":"Rotational kinetic energy","l":7,"d":"2026-10-12","tc":"Manish Raj Sir"},{"id":"PHY-088","s":"Physics","c":"Rotational Motion","t":"Conservation of mechanical energy","l":8,"d":"2026-10-13","tc":"Manish Raj Sir"},{"id":"PHY-089","s":"Physics","c":"Rotational Motion","t":"Rolling motion; rolling on inclined plane","l":9,"d":"2026-10-14","tc":"Manish Raj Sir"},{"id":"PHY-090","s":"Physics","c":"Rotational Motion","t":"Translational vs rotational motion comparison","l":10,"d":"2026-10-15","tc":"Manish Raj Sir"},{"id":"PHY-091","s":"Physics","c":"Rotational Motion","t":"Translational vs rotational motion comparison","l":11,"d":"2026-10-16","tc":"Manish Raj Sir"},{"id":"PHY-092","s":"Physics","c":"Rotational Motion","t":"Question Practice","l":12,"d":"2026-10-17","tc":"Manish Raj Sir"},{"id":"PHY-093","s":"Physics","c":"Gravitation","t":"Law of Gravitation","l":1,"d":"2026-10-19","tc":"Manish Raj Sir"},{"id":"PHY-094","s":"Physics","c":"Gravitation","t":"Acceleration due to gravity","l":2,"d":"2026-10-21","tc":"Manish Raj Sir"},{"id":"PHY-095","s":"Physics","c":"Gravitation","t":"Gravitational potential energy; potential","l":3,"d":"2026-10-22","tc":"Manish Raj Sir"},{"id":"PHY-096","s":"Physics","c":"Gravitation","t":"Field-potential relation; escape velocity; satellite motion","l":4,"d":"2026-10-23","tc":"Manish Raj Sir"},{"id":"PHY-097","s":"Physics","c":"Gravitation","t":"Kepler's laws","l":5,"d":"2026-10-24","tc":"Manish Raj Sir"},{"id":"PHY-098","s":"Physics","c":"Gravitation","t":"Question Practice","l":6,"d":"2026-10-26","tc":"Manish Raj Sir"},{"id":"PHY-099","s":"Physics","c":"Mechanical Properties of Solids","t":"Elasticity; stress; strain; Hooke's law","l":1,"d":"2026-10-27","tc":"Manish Raj Sir"},{"id":"PHY-100","s":"Physics","c":"Mechanical Properties of Solids","t":"Modulus of elasticity; Young's modulus","l":2,"d":"2026-10-28","tc":"Manish Raj Sir"},{"id":"PHY-101","s":"Physics","c":"Mechanical Properties of Solids","t":"Question Practice","l":3,"d":"2026-10-29","tc":"Manish Raj Sir"},{"id":"PHY-102","s":"Physics","c":"Mechanical Properties of Fluids","t":"Introduction of hydrostatics","l":1,"d":"2026-10-30","tc":"Manish Raj Sir"},{"id":"PHY-103","s":"Physics","c":"Mechanical Properties of Fluids","t":"Pressure","l":2,"d":"2026-10-31","tc":"Manish Raj Sir"},{"id":"PHY-104","s":"Physics","c":"Mechanical Properties of Fluids","t":"Pascal's law","l":3,"d":"2026-11-02","tc":"Manish Raj Sir"},{"id":"PHY-105","s":"Physics","c":"Mechanical Properties of Fluids","t":"Buoyancy; buoyant force","l":4,"d":"2026-11-03","tc":"Manish Raj Sir"},{"id":"PHY-106","s":"Physics","c":"Mechanical Properties of Fluids","t":"Hydrodynamics; equation of continuity","l":5,"d":"2026-11-04","tc":"Manish Raj Sir"},{"id":"PHY-107","s":"Physics","c":"Mechanical Properties of Fluids","t":"Bernoulli theorem","l":6,"d":"2026-11-05","tc":"Manish Raj Sir"},{"id":"PHY-108","s":"Physics","c":"Mechanical Properties of Fluids","t":"Viscosity; Surface tension","l":7,"d":"2026-11-10","tc":"Manish Raj Sir"},{"id":"PHY-109","s":"Physics","c":"Mechanical Properties of Fluids","t":"Question Practice","l":8,"d":"2026-11-12","tc":"Manish Raj Sir"},{"id":"PHY-110","s":"Physics","c":"Thermal Properties of matter","t":"Thermal expansion","l":1,"d":"2026-11-13","tc":"Manish Raj Sir"},{"id":"PHY-111","s":"Physics","c":"Thermal Properties of matter","t":"Application of thermal expansion","l":2,"d":"2026-11-14","tc":"Manish Raj Sir"},{"id":"PHY-112","s":"Physics","c":"Thermal Properties of matter","t":"Specific heat capacity","l":3,"d":"2026-11-17","tc":"Manish Raj Sir"},{"id":"PHY-113","s":"Physics","c":"Thermal Properties of matter","t":"Latent heat; calorimetry","l":4,"d":"2026-11-18","tc":"Manish Raj Sir"},{"id":"PHY-114","s":"Physics","c":"Thermal Properties of matter","t":"Heat transfer: conduction convection radiation","l":5,"d":"2026-11-19","tc":"Manish Raj Sir"},{"id":"PHY-115","s":"Physics","c":"Thermal Properties of matter","t":"Question Practice","l":6,"d":"2026-11-20","tc":"Manish Raj Sir"},{"id":"PHY-116","s":"Physics","c":"Kinetic Theory","t":"Ideal gases; real gas equation","l":1,"d":"2026-11-21","tc":"Manish Raj Sir"},{"id":"PHY-117","s":"Physics","c":"Kinetic Theory","t":"Question Practice","l":2,"d":"2026-11-23","tc":"Manish Raj Sir"},{"id":"PHY-118","s":"Physics","c":"Thermodynamics","t":"Intro; thermal equilibrium; zeroth law; first law","l":1,"d":"2026-11-24","tc":"Manish Raj Sir"},{"id":"PHY-119","s":"Physics","c":"Thermodynamics","t":"Different type of processes","l":2,"d":"2026-11-25","tc":"Manish Raj Sir"},{"id":"PHY-120","s":"Physics","c":"Thermodynamics","t":"Second law; heat engine; carnot cycle; heat pump; refrigerator","l":3,"d":"2026-11-26","tc":"Manish Raj Sir"},{"id":"PHY-121","s":"Physics","c":"Thermodynamics","t":"Question Practice","l":4,"d":"2026-11-27","tc":"Manish Raj Sir"},{"id":"PHY-122","s":"Physics","c":"Oscillations","t":"Periodic and oscillatory motion","l":1,"d":"2026-11-28","tc":"Manish Raj Sir"},{"id":"PHY-123","s":"Physics","c":"Oscillations","t":"Basic terms of oscillatory motion","l":2,"d":"2026-11-30","tc":"Manish Raj Sir"},{"id":"PHY-124","s":"Physics","c":"Oscillations","t":"SHM; equations of SHM","l":3,"d":"2026-12-01","tc":"Manish Raj Sir"},{"id":"PHY-125","s":"Physics","c":"Oscillations","t":"Energy in SHM","l":4,"d":"2026-12-02","tc":"Manish Raj Sir"},{"id":"PHY-126","s":"Physics","c":"Oscillations","t":"Time period of spring block system","l":5,"d":"2026-12-03","tc":"Manish Raj Sir"},{"id":"PHY-127","s":"Physics","c":"Oscillations","t":"Question Practice","l":6,"d":"2026-12-04","tc":"Manish Raj Sir"},{"id":"PHY-128","s":"Physics","c":"Waves","t":"Waves; equation of waves","l":1,"d":"2026-12-05","tc":"Manish Raj Sir"},{"id":"PHY-129","s":"Physics","c":"Waves","t":"Characteristics of waves","l":2,"d":"2026-12-07","tc":"Manish Raj Sir"},{"id":"PHY-130","s":"Physics","c":"Waves","t":"Progressive wave; velocity; intensity; sound waves","l":3,"d":"2026-12-08","tc":"Manish Raj Sir"},{"id":"PHY-131","s":"Physics","c":"Waves","t":"Superposition; Reflection and refraction of waves","l":4,"d":"2026-12-09","tc":"Manish Raj Sir"},{"id":"PHY-132","s":"Physics","c":"Waves","t":"Stationary waves","l":5,"d":"2026-12-10","tc":"Manish Raj Sir"},{"id":"PHY-133","s":"Physics","c":"Waves","t":"Question Practice","l":6,"d":"2026-12-11","tc":"Manish Raj Sir"},{"id":"PHY-134","s":"Physics","c":"Electric Charges and Fields","t":"Introduction; Charge","l":1,"d":"2026-12-12","tc":"Manish Raj Sir"},{"id":"PHY-135","s":"Physics","c":"Electric Charges and Fields","t":"Coulomb's Law","l":2,"d":"2026-12-14","tc":"Manish Raj Sir"},{"id":"PHY-136","s":"Physics","c":"Electric Charges and Fields","t":"Coulomb's Law","l":3,"d":"2026-12-15","tc":"Manish Raj Sir"},{"id":"PHY-137","s":"Physics","c":"Electric Charges and Fields","t":"Electric Field; Conductors and Insulators","l":4,"d":"2026-12-16","tc":"Manish Raj Sir"},{"id":"PHY-138","s":"Physics","c":"Electric Charges and Fields","t":"Electric Field of Continuous Charge Distribution","l":5,"d":"2026-12-17","tc":"Manish Raj Sir"},{"id":"PHY-139","s":"Physics","c":"Electric Charges and Fields","t":"Field of Continuous Distribution; Charged Particle Motion","l":6,"d":"2026-12-18","tc":"Manish Raj Sir"},{"id":"PHY-140","s":"Physics","c":"Electric Charges and Fields","t":"Electric Field Lines; Electric Flux","l":7,"d":"2026-12-19","tc":"Manish Raj Sir"},{"id":"PHY-141","s":"Physics","c":"Electric Charges and Fields","t":"Gauss Law; Application","l":8,"d":"2026-12-21","tc":"Manish Raj Sir"},{"id":"PHY-142","s":"Physics","c":"Electric Charges and Fields","t":"Electric Dipole","l":9,"d":"2026-12-22","tc":"Manish Raj Sir"},{"id":"PHY-143","s":"Physics","c":"Electric Charges and Fields","t":"Question Practice","l":10,"d":"2026-12-23","tc":"Manish Raj Sir"},{"id":"PHY-144","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Relation between E and V","l":2,"d":"2026-12-24","tc":"Manish Raj Sir"},{"id":"PHY-145","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Equipotential Surface","l":3,"d":"2026-12-26","tc":"Manish Raj Sir"},{"id":"PHY-146","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Electrostatic PE; Potential due to dipole","l":4,"d":"2026-12-28","tc":"Manish Raj Sir"},{"id":"PHY-147","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Electrostatics of Conductor","l":5,"d":"2026-12-29","tc":"Manish Raj Sir"},{"id":"PHY-148","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Electrostatics of Conductor","l":6,"d":"2026-12-30","tc":"Manish Raj Sir"},{"id":"PHY-149","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Conductor and its capacitance","l":7,"d":"2026-12-31","tc":"Manish Raj Sir"},{"id":"PHY-150","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Capacitor and its capacitance","l":8,"d":"2027-01-02","tc":"Manish Raj Sir"},{"id":"PHY-151","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Charging of capacitor; Combination of capacitors","l":9,"d":"2027-01-04","tc":"Manish Raj Sir"},{"id":"PHY-152","s":"Physics","c":"Electrostatic Potential and Capacitance","t":"Question Practice","l":10,"d":"2027-01-05","tc":"Manish Raj Sir"},{"id":"PHY-153","s":"Physics","c":"Current Electricity","t":"Electric Current","l":1,"d":"2027-01-06","tc":"Manish Raj Sir"},{"id":"PHY-154","s":"Physics","c":"Current Electricity","t":"Current in Conductors","l":2,"d":"2027-01-07","tc":"Manish Raj Sir"},{"id":"PHY-155","s":"Physics","c":"Current Electricity","t":"Current in Conductors","l":3,"d":"2027-01-08","tc":"Manish Raj Sir"},{"id":"PHY-156","s":"Physics","c":"Current Electricity","t":"Kirchhoff's Laws and Combination of Resistances","l":4,"d":"2027-01-09","tc":"Manish Raj Sir"},{"id":"PHY-157","s":"Physics","c":"Current Electricity","t":"Kirchhoff's Laws and Combination of Resistances","l":5,"d":"2027-01-11","tc":"Manish Raj Sir"},{"id":"PHY-158","s":"Physics","c":"Current Electricity","t":"Wheatstone Bridge and Symmetric Circuits","l":6,"d":"2027-01-12","tc":"Manish Raj Sir"},{"id":"PHY-159","s":"Physics","c":"Current Electricity","t":"Electrical Measuring Instruments","l":7,"d":"2027-01-13","tc":"Manish Raj Sir"},{"id":"PHY-160","s":"Physics","c":"Current Electricity","t":"Electrical Measuring Instruments","l":8,"d":"2027-01-14","tc":"Manish Raj Sir"},{"id":"PHY-161","s":"Physics","c":"Current Electricity","t":"Question Practice","l":9,"d":"2027-01-16","tc":"Manish Raj Sir"},{"id":"PHY-162","s":"Physics","c":"Moving Charges and Magnetism","t":"Introduction","l":1,"d":"2027-01-18","tc":"Manish Raj Sir"},{"id":"PHY-163","s":"Physics","c":"Moving Charges and Magnetism","t":"Biot-Savart's Law","l":2,"d":"2027-01-19","tc":"Manish Raj Sir"},{"id":"PHY-164","s":"Physics","c":"Moving Charges and Magnetism","t":"Field due to current carrying Ring; combinations","l":3,"d":"2027-01-20","tc":"Manish Raj Sir"},{"id":"PHY-165","s":"Physics","c":"Moving Charges and Magnetism","t":"Field due to current carrying Ring; combinations","l":4,"d":"2027-01-21","tc":"Manish Raj Sir"},{"id":"PHY-166","s":"Physics","c":"Moving Charges and Magnetism","t":"Ampere's Law and Applications","l":5,"d":"2027-01-22","tc":"Manish Raj Sir"},{"id":"PHY-167","s":"Physics","c":"Moving Charges and Magnetism","t":"Force on moving charge; Helical Path; Lorentz Force","l":6,"d":"2027-01-23","tc":"Manish Raj Sir"},{"id":"PHY-168","s":"Physics","c":"Moving Charges and Magnetism","t":"Question Practice","l":7,"d":"2027-01-25","tc":"Manish Raj Sir"},{"id":"PHY-169","s":"Physics","c":"Magnetism and Matter","t":"Bar Magnet; Circular coil; Tangent Galvanometer; Oscillation Magnetometer","l":1,"d":"2027-01-27","tc":"Manish Raj Sir"},{"id":"PHY-170","s":"Physics","c":"Magnetism and Matter","t":"Question Practice","l":2,"d":"2027-01-28","tc":"Manish Raj Sir"},{"id":"PHY-171","s":"Physics","c":"Electromagnetic Induction","t":"Magnetic Flux and Lenz's Law","l":1,"d":"2027-01-29","tc":"Manish Raj Sir"},{"id":"PHY-172","s":"Physics","c":"Electromagnetic Induction","t":"Faraday's Law; Calculation of Induced EMF","l":2,"d":"2027-01-30","tc":"Manish Raj Sir"},{"id":"PHY-173","s":"Physics","c":"Electromagnetic Induction","t":"Induced Electric Field; Self Inductance","l":3,"d":"2027-02-01","tc":"Manish Raj Sir"},{"id":"PHY-174","s":"Physics","c":"Electromagnetic Induction","t":"Mutual Inductance; Inductor in Circuits","l":4,"d":"2027-02-02","tc":"Manish Raj Sir"},{"id":"PHY-175","s":"Physics","c":"Electromagnetic Induction","t":"Question Practice","l":5,"d":"2027-02-03","tc":"Manish Raj Sir"},{"id":"PHY-176","s":"Physics","c":"Alternating Current","t":"Intro to AC; Average and RMS Values","l":1,"d":"2027-02-04","tc":"Manish Raj Sir"},{"id":"PHY-177","s":"Physics","c":"Alternating Current","t":"Types of AC Circuits; Power and Power Factor","l":2,"d":"2027-02-05","tc":"Manish Raj Sir"},{"id":"PHY-178","s":"Physics","c":"Alternating Current","t":"Question Practice","l":3,"d":"2027-02-06","tc":"Manish Raj Sir"},{"id":"PHY-179","s":"Physics","c":"Electromagnetic Waves","t":"Characteristics of EM Waves","l":1,"d":"2027-02-08","tc":"Manish Raj Sir"},{"id":"PHY-180","s":"Physics","c":"Electromagnetic Waves","t":"Question Practice","l":2,"d":"2027-02-09","tc":"Manish Raj Sir"},{"id":"PHY-181","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Intro of optics; Reflection of light","l":1,"d":"2027-02-10","tc":"Manish Raj Sir"},{"id":"PHY-182","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Reflection from plane mirror","l":2,"d":"2027-02-11","tc":"Manish Raj Sir"},{"id":"PHY-183","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Reflection from spherical mirror","l":3,"d":"2027-02-12","tc":"Manish Raj Sir"},{"id":"PHY-184","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Refraction of light; refraction from plane surface","l":4,"d":"2027-02-13","tc":"Manish Raj Sir"},{"id":"PHY-185","s":"Physics","c":"Ray Optics and Optical Instruments","t":"TIR; refraction from curved surface; lens and power","l":5,"d":"2027-02-15","tc":"Manish Raj Sir"},{"id":"PHY-186","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Newton's Formula; Combination of lens and mirror","l":6,"d":"2027-02-16","tc":"Manish Raj Sir"},{"id":"PHY-187","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Displacement method to find focal length","l":7,"d":"2027-02-17","tc":"Manish Raj Sir"},{"id":"PHY-188","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Refraction from prism","l":8,"d":"2027-02-18","tc":"Manish Raj Sir"},{"id":"PHY-189","s":"Physics","c":"Ray Optics and Optical Instruments","t":"Question Practice","l":9,"d":"2027-02-19","tc":"Manish Raj Sir"},{"id":"PHY-190","s":"Physics","c":"Wave Optics","t":"Wave nature of light","l":1,"d":"2027-02-20","tc":"Manish Raj Sir"},{"id":"PHY-191","s":"Physics","c":"Wave Optics","t":"Nature of light","l":2,"d":"2027-02-22","tc":"Manish Raj Sir"},{"id":"PHY-192","s":"Physics","c":"Wave Optics","t":"Interference of light","l":3,"d":"2027-02-23","tc":"Manish Raj Sir"},{"id":"PHY-193","s":"Physics","c":"Wave Optics","t":"Question Practice","l":4,"d":"2027-02-24","tc":"Manish Raj Sir"},{"id":"PHY-194","s":"Physics","c":"Dual Nature of Radiation and Matter","t":"Quantum theory of light","l":1,"d":"2027-02-25","tc":"Manish Raj Sir"},{"id":"PHY-195","s":"Physics","c":"Dual Nature of Radiation and Matter","t":"Photoelectric effect","l":2,"d":"2027-02-26","tc":"Manish Raj Sir"},{"id":"PHY-196","s":"Physics","c":"Dual Nature of Radiation and Matter","t":"Question Practice","l":3,"d":"2027-02-27","tc":"Manish Raj Sir"},{"id":"PHY-197","s":"Physics","c":"Atoms","t":"Atomic model; Rutherford model","l":1,"d":"2027-03-01","tc":"Manish Raj Sir"},{"id":"PHY-198","s":"Physics","c":"Atoms","t":"Question Practice","l":2,"d":"2027-03-02","tc":"Manish Raj Sir"},{"id":"PHY-199","s":"Physics","c":"Nuclei","t":"Nuclei; Mass energy","l":1,"d":"2027-03-03","tc":"Manish Raj Sir"},{"id":"PHY-200","s":"Physics","c":"Nuclei","t":"Question Practice","l":2,"d":"2027-03-04","tc":"Manish Raj Sir"},{"id":"PHY-201","s":"Physics","c":"Semiconductor Electronics","t":"Intro to Semiconductors; Intrinsic and Extrinsic","l":1,"d":"2027-03-05","tc":"Manish Raj Sir"},{"id":"PHY-202","s":"Physics","c":"Semiconductor Electronics","t":"PN Junction Diode; Applications","l":2,"d":"2027-03-08","tc":"Manish Raj Sir"},{"id":"PHY-203","s":"Physics","c":"Semiconductor Electronics","t":"Question Practice","l":3,"d":"2027-03-09","tc":"Manish Raj Sir"},{"id":"PCH-001","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Dalton's Atomic Theory; Types of particle and calculation","l":1,"d":"2026-06-29","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-002","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Molar Mass AMU Mole","l":2,"d":"2026-06-30","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-003","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Mole concept; Average molar Mass","l":3,"d":"2026-07-01","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-004","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"VD; Mass % Age; Average Molar Mass","l":4,"d":"2026-07-02","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-005","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Stoichiometry; Limiting reagent","l":5,"d":"2026-07-03","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-006","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"% age yield; Impure sample; Laws of chemical combination","l":6,"d":"2026-07-04","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-007","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"EF and EF Concentration Terms","l":7,"d":"2026-07-06","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-008","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Concentration Term Continuous","l":8,"d":"2026-07-07","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-009","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Equivalents Mass Normality","l":9,"d":"2026-07-08","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-010","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Equivalents Mass Normality","l":10,"d":"2026-07-09","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-011","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Concentration of mixture","l":11,"d":"2026-07-10","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-012","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Law of equivalent","l":12,"d":"2026-07-11","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-013","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Significant Feature","l":13,"d":"2026-07-13","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-014","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Significant Feature","l":14,"d":"2026-07-14","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-015","s":"Physical Chemistry","c":"Some Basic Concept of Chemistry","t":"Question Practice","l":15,"d":"2026-07-15","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-016","s":"Physical Chemistry","c":"Redox Reaction","t":"Oxidation Reduction and Oxidation Number Calculation","l":1,"d":"2026-07-16","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-017","s":"Physical Chemistry","c":"Redox Reaction","t":"n-Factor Calculation","l":2,"d":"2026-07-17","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-018","s":"Physical Chemistry","c":"Redox Reaction","t":"Balancing of Redox Reactions; Redox Titrations-1","l":3,"d":"2026-07-18","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-019","s":"Physical Chemistry","c":"Redox Reaction","t":"Redox Titrations-2","l":4,"d":"2026-07-20","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-020","s":"Physical Chemistry","c":"Redox Reaction","t":"Question Practice","l":5,"d":"2026-07-21","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-021","s":"Physical Chemistry","c":"Solutions","t":"Solution","l":1,"d":"2026-07-22","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-022","s":"Physical Chemistry","c":"Solutions","t":"Binary Solution and Concentration Terms","l":2,"d":"2026-07-23","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-023","s":"Physical Chemistry","c":"Solutions","t":"Solubility and Henry Law","l":3,"d":"2026-07-24","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-024","s":"Physical Chemistry","c":"Solutions","t":"Raoult's law and application","l":4,"d":"2026-07-25","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-025","s":"Physical Chemistry","c":"Solutions","t":"Ideal and non ideal solutions","l":5,"d":"2026-07-27","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-026","s":"Physical Chemistry","c":"Solutions","t":"Colligative properties-1","l":6,"d":"2026-07-28","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-027","s":"Physical Chemistry","c":"Solutions","t":"Colligative properties-2","l":7,"d":"2026-07-29","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-028","s":"Physical Chemistry","c":"Solutions","t":"Abnormal molar mass","l":8,"d":"2026-07-30","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-029","s":"Physical Chemistry","c":"Solutions","t":"Abnormal molar mass","l":9,"d":"2026-07-31","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-030","s":"Physical Chemistry","c":"Solutions","t":"Question Practice","l":10,"d":"2026-08-01","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-031","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Thermodynamics Parameters; Pressure-volume work","l":1,"d":"2026-08-03","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-032","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"First law of thermodynamics","l":2,"d":"2026-08-04","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-033","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Heat Capacity","l":3,"d":"2026-08-05","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-034","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Adiabatic work","l":4,"d":"2026-08-06","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-035","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Spontaneity of processes; Entropy","l":5,"d":"2026-08-07","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-036","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Gibbs Free Energy","l":6,"d":"2026-08-08","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-037","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Second law of thermodynamics","l":7,"d":"2026-08-10","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-038","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Thermodynamics and application","l":8,"d":"2026-08-11","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-039","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Thermochemistry","l":9,"d":"2026-08-12","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-040","s":"Physical Chemistry","c":"Thermodynamics and Thermochemistry","t":"Question Practice","l":10,"d":"2026-08-13","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-041","s":"Physical Chemistry","c":"Chemical Equilibrium","t":"Introduction to Chemical Equilibrium","l":1,"d":"2026-08-14","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-042","s":"Physical Chemistry","c":"Chemical Equilibrium","t":"Equilibrium Constant and Characteristics","l":2,"d":"2026-08-17","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-043","s":"Physical Chemistry","c":"Chemical Equilibrium","t":"Applications of Equilibrium Constant","l":3,"d":"2026-08-18","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-044","s":"Physical Chemistry","c":"Chemical Equilibrium","t":"Le Chatelier's principle","l":4,"d":"2026-08-19","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-045","s":"Physical Chemistry","c":"Chemical Equilibrium","t":"Question Practice","l":5,"d":"2026-08-20","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-046","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"Ostwald's Dilution law and common ion effect","l":1,"d":"2026-08-21","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-047","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"Ionic product of water and pH concept","l":2,"d":"2026-08-22","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-048","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"Salt Hydrolysis","l":3,"d":"2026-08-24","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-049","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"pH of salt solutions","l":4,"d":"2026-08-25","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-050","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"Buffer solution","l":5,"d":"2026-08-26","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-051","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"Solubility product","l":6,"d":"2026-08-27","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-052","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"Precipitation; Indicators and titration","l":7,"d":"2026-08-29","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-053","s":"Physical Chemistry","c":"Ionic Equilibrium","t":"Question Practice","l":8,"d":"2026-08-31","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-054","s":"Physical Chemistry","c":"Electrochemistry","t":"Introduction to Electrolysis and Laws of electrolysis","l":1,"d":"2026-09-01","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-055","s":"Physical Chemistry","c":"Electrochemistry","t":"Electrolytic conductance-1","l":2,"d":"2026-09-02","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-056","s":"Physical Chemistry","c":"Electrochemistry","t":"Electrolytic conductance-2","l":3,"d":"2026-09-03","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-057","s":"Physical Chemistry","c":"Electrochemistry","t":"Kohlrausch's Law; Qualitative and quantitative Electrolysis","l":4,"d":"2026-09-04","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-058","s":"Physical Chemistry","c":"Electrochemistry","t":"Electrochemical Cell; Galvanic cells; SEP; EMF","l":5,"d":"2026-09-05","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-059","s":"Physical Chemistry","c":"Electrochemistry","t":"Nernst Equation; Concentration cells; Types of Batteries","l":6,"d":"2026-09-07","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-060","s":"Physical Chemistry","c":"Electrochemistry","t":"Question Practice","l":7,"d":"2026-09-08","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-061","s":"Physical Chemistry","c":"Chemical Kinetics","t":"Rate of Reaction; Integrated Rate Equations","l":1,"d":"2026-09-09","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-062","s":"Physical Chemistry","c":"Chemical Kinetics","t":"Methods to determine order of reaction; Pseudo/Zero order","l":2,"d":"2026-09-10","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-063","s":"Physical Chemistry","c":"Chemical Kinetics","t":"First order reaction; half life; graphical methods","l":3,"d":"2026-09-11","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-064","s":"Physical Chemistry","c":"Chemical Kinetics","t":"Collision theory; Activation energy; Catalyst; Nuclear reactions basics","l":4,"d":"2026-09-12","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-065","s":"Physical Chemistry","c":"Chemical Kinetics","t":"Nuclear Stability; Radioactive Decay; Fission Fusion; Carbon Dating","l":5,"d":"2026-09-15","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-066","s":"Physical Chemistry","c":"Chemical Kinetics","t":"Question Practice","l":6,"d":"2026-09-16","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-067","s":"Physical Chemistry","c":"Structure of Atom","t":"Discovery of Fundamental Particles","l":1,"d":"2026-09-17","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-068","s":"Physical Chemistry","c":"Structure of Atom","t":"Atomic Models and failure; Energy as particle/wave","l":2,"d":"2026-09-18","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-069","s":"Physical Chemistry","c":"Structure of Atom","t":"Photoelectric effect and Black Body radiation","l":3,"d":"2026-09-19","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-070","s":"Physical Chemistry","c":"Structure of Atom","t":"Bohr's Atomic Model; Atomic Spectra","l":4,"d":"2026-09-21","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-071","s":"Physical Chemistry","c":"Structure of Atom","t":"Dual nature; Quantum intro; Wave mechanical model; Quantum numbers","l":5,"d":"2026-09-22","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-072","s":"Physical Chemistry","c":"Structure of Atom","t":"Question Practice","l":6,"d":"2026-09-23","tc":"Sudhanshu Kumar Sir"},{"id":"PCH-073","s":"Physical Chemistry","c":"Practical Physical Chemistry","t":"Practical Physical Chemistry; Question Practice","l":1,"d":"2027-03-09","tc":"Sudhanshu Kumar Sir"},{"id":"OCH-001","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"Tetravalency of carbon; hybridization; classification of organic compounds","l":1,"d":"2026-10-31","tc":"Pankaj Sijariya Sir"},{"id":"OCH-002","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"Degree of C H Alcohol Amine; Degree of Unsaturation; Functional Group","l":2,"d":"2026-11-02","tc":"Pankaj Sijariya Sir"},{"id":"OCH-003","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"IUPAC of Alkane","l":3,"d":"2026-11-03","tc":"Pankaj Sijariya Sir"},{"id":"OCH-004","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"IUPAC of Alkene Cycloalkene","l":4,"d":"2026-11-04","tc":"Pankaj Sijariya Sir"},{"id":"OCH-005","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"IUPAC of Functional Group","l":5,"d":"2026-11-05","tc":"Pankaj Sijariya Sir"},{"id":"OCH-006","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"Polyfunctional Group","l":6,"d":"2026-11-10","tc":"Pankaj Sijariya Sir"},{"id":"OCH-007","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"IUPAC of Aromatic Compound; Common Naming","l":7,"d":"2026-11-12","tc":"Pankaj Sijariya Sir"},{"id":"OCH-008","s":"Organic Chemistry","c":"GOC - IUPAC Naming","t":"Question Practice","l":8,"d":"2026-11-13","tc":"Pankaj Sijariya Sir"},{"id":"OCH-009","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Isomerism and Types; Structural Isomerism","l":1,"d":"2026-11-14","tc":"Pankaj Sijariya Sir"},{"id":"OCH-010","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Isomerism and Types; Structural Isomerism","l":2,"d":"2026-11-17","tc":"Pankaj Sijariya Sir"},{"id":"OCH-011","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Geometrical isomerism; Cis-trans Z/E CIP rule","l":3,"d":"2026-11-18","tc":"Pankaj Sijariya Sir"},{"id":"OCH-012","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Special cases of G.I; Calculation of G.I","l":4,"d":"2026-11-19","tc":"Pankaj Sijariya Sir"},{"id":"OCH-013","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Conformations: Sawhorse and Newman projections","l":5,"d":"2026-11-20","tc":"Pankaj Sijariya Sir"},{"id":"OCH-014","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Optical isomerism basics; Polarimeter; Chiral Centre","l":6,"d":"2026-11-21","tc":"Pankaj Sijariya Sir"},{"id":"OCH-015","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Optical isomerism; Plane and Centre of symmetry","l":7,"d":"2026-11-23","tc":"Pankaj Sijariya Sir"},{"id":"OCH-016","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Optical isomerism; Fischer Projection; R S configuration","l":8,"d":"2026-11-24","tc":"Pankaj Sijariya Sir"},{"id":"OCH-017","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Optical isomerism; Exhibition of Optical isomerism","l":9,"d":"2026-11-25","tc":"Pankaj Sijariya Sir"},{"id":"OCH-018","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Enantiomers Diastereomers Racemic Mixture Resolution Meso Compound","l":10,"d":"2026-11-26","tc":"Pankaj Sijariya Sir"},{"id":"OCH-019","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Pseudo Chiral Centre; D L Config; Erythro Threo Epimer Anomers","l":11,"d":"2026-11-27","tc":"Pankaj Sijariya Sir"},{"id":"OCH-020","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Pseudo Chiral Centre continued; PYQs","l":12,"d":"2026-11-28","tc":"Pankaj Sijariya Sir"},{"id":"OCH-021","s":"Organic Chemistry","c":"GOC - Isomerism","t":"Question Practice","l":13,"d":"2026-11-30","tc":"Pankaj Sijariya Sir"},{"id":"OCH-022","s":"Organic Chemistry","c":"GOC - GOC","t":"Covalent bond fission; Homolytic Heterolytic; Inductive Effect","l":1,"d":"2026-12-01","tc":"Pankaj Sijariya Sir"},{"id":"OCH-023","s":"Organic Chemistry","c":"GOC - GOC","t":"Hyperconjugation","l":2,"d":"2026-12-02","tc":"Pankaj Sijariya Sir"},{"id":"OCH-024","s":"Organic Chemistry","c":"GOC - GOC","t":"Application of Hyperconjugation","l":3,"d":"2026-12-03","tc":"Pankaj Sijariya Sir"},{"id":"OCH-025","s":"Organic Chemistry","c":"GOC - GOC","t":"Resonance Part-1","l":4,"d":"2026-12-04","tc":"Pankaj Sijariya Sir"},{"id":"OCH-026","s":"Organic Chemistry","c":"GOC - GOC","t":"Resonance Part-2; Stability of resonating Structures","l":5,"d":"2026-12-05","tc":"Pankaj Sijariya Sir"},{"id":"OCH-027","s":"Organic Chemistry","c":"GOC - GOC","t":"Resonance Part-2 continued","l":6,"d":"2026-12-07","tc":"Pankaj Sijariya Sir"},{"id":"OCH-028","s":"Organic Chemistry","c":"GOC - GOC","t":"Aromaticity; Annulene","l":7,"d":"2026-12-08","tc":"Pankaj Sijariya Sir"},{"id":"OCH-029","s":"Organic Chemistry","c":"GOC - GOC","t":"Mesomeric Effect","l":8,"d":"2026-12-09","tc":"Pankaj Sijariya Sir"},{"id":"OCH-030","s":"Organic Chemistry","c":"GOC - GOC","t":"Stability of Intermediates; Bond Length and Strength","l":9,"d":"2026-12-10","tc":"Pankaj Sijariya Sir"},{"id":"OCH-031","s":"Organic Chemistry","c":"GOC - GOC","t":"Stability of Intermediates continued","l":10,"d":"2026-12-11","tc":"Pankaj Sijariya Sir"},{"id":"OCH-032","s":"Organic Chemistry","c":"GOC - GOC","t":"Stability of Intermediates continued","l":11,"d":"2026-12-12","tc":"Pankaj Sijariya Sir"},{"id":"OCH-033","s":"Organic Chemistry","c":"GOC - GOC","t":"Acidic Strength","l":12,"d":"2026-12-14","tc":"Pankaj Sijariya Sir"},{"id":"OCH-034","s":"Organic Chemistry","c":"GOC - GOC","t":"Basic Strength","l":13,"d":"2026-12-15","tc":"Pankaj Sijariya Sir"},{"id":"OCH-035","s":"Organic Chemistry","c":"GOC - GOC","t":"Tautomerism; Electrophiles Nucleophiles; Types of reactions; PYQs","l":14,"d":"2026-12-16","tc":"Pankaj Sijariya Sir"},{"id":"OCH-036","s":"Organic Chemistry","c":"GOC - GOC","t":"Question Practice","l":15,"d":"2026-12-17","tc":"Pankaj Sijariya Sir"},{"id":"OCH-037","s":"Organic Chemistry","c":"Hydrocarbon","t":"Basic Organic Chemistry","l":1,"d":"2026-12-18","tc":"Pankaj Sijariya Sir"},{"id":"OCH-038","s":"Organic Chemistry","c":"Hydrocarbon","t":"Rearrangement of Carbocation; Types of Reaction","l":2,"d":"2026-12-19","tc":"Pankaj Sijariya Sir"},{"id":"OCH-039","s":"Organic Chemistry","c":"Hydrocarbon","t":"Method of Preparation of Alkane Part 1-2","l":3,"d":"2026-12-21","tc":"Pankaj Sijariya Sir"},{"id":"OCH-040","s":"Organic Chemistry","c":"Hydrocarbon","t":"Chemical and Physical Properties of Alkane; Halogenation mechanism","l":4,"d":"2026-12-22","tc":"Pankaj Sijariya Sir"},{"id":"OCH-041","s":"Organic Chemistry","c":"Hydrocarbon","t":"Method of Preparation of Alkene Part 1-2","l":5,"d":"2026-12-23","tc":"Pankaj Sijariya Sir"},{"id":"OCH-042","s":"Organic Chemistry","c":"Hydrocarbon","t":"Preparation of Alkene Part 3; Electrophilic addition mechanism","l":6,"d":"2026-12-24","tc":"Pankaj Sijariya Sir"},{"id":"OCH-043","s":"Organic Chemistry","c":"Hydrocarbon","t":"Electrophilic addition: Water hydrogen halides Markownikoff peroxide effect","l":7,"d":"2026-12-26","tc":"Pankaj Sijariya Sir"},{"id":"OCH-044","s":"Organic Chemistry","c":"Hydrocarbon","t":"Ozonolysis and polymerization; Preparation of Alkyne","l":8,"d":"2026-12-28","tc":"Pankaj Sijariya Sir"},{"id":"OCH-045","s":"Organic Chemistry","c":"Hydrocarbon","t":"Chemical Properties of Alkyne; Acidic character; Addition reactions; Polymerization","l":9,"d":"2026-12-29","tc":"Pankaj Sijariya Sir"},{"id":"OCH-046","s":"Organic Chemistry","c":"Hydrocarbon","t":"MOP of benzene; Electrophilic substitution; Friedel-Crafts; directive influence; PYQs","l":10,"d":"2026-12-30","tc":"Pankaj Sijariya Sir"},{"id":"OCH-047","s":"Organic Chemistry","c":"Hydrocarbon","t":"Question Practice","l":11,"d":"2026-12-31","tc":"Pankaj Sijariya Sir"},{"id":"OCH-048","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Methods of preparation of haloalkanes","l":1,"d":"2027-01-02","tc":"Pankaj Sijariya Sir"},{"id":"OCH-049","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Chemical Properties; Nature of C-X bond; Substitution mechanisms","l":2,"d":"2027-01-04","tc":"Pankaj Sijariya Sir"},{"id":"OCH-050","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Chemical Properties; Elimination Reactions","l":3,"d":"2027-01-05","tc":"Pankaj Sijariya Sir"},{"id":"OCH-051","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Reaction with metals; Uses; Environmental effects","l":4,"d":"2027-01-06","tc":"Pankaj Sijariya Sir"},{"id":"OCH-052","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Methods of preparation of haloarenes","l":5,"d":"2027-01-07","tc":"Pankaj Sijariya Sir"},{"id":"OCH-053","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Aromatic nucleophilic substitution; Benzyne mechanism","l":6,"d":"2027-01-08","tc":"Pankaj Sijariya Sir"},{"id":"OCH-054","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Grignard reagent preparation and properties","l":7,"d":"2027-01-09","tc":"Pankaj Sijariya Sir"},{"id":"OCH-055","s":"Organic Chemistry","c":"Haloalkanes and Haloarenes","t":"Question Practice","l":8,"d":"2027-01-11","tc":"Pankaj Sijariya Sir"},{"id":"OCH-056","s":"Organic Chemistry","c":"Alcohols Ethers Phenols","t":"Intro to alcohols; identification of 1-2-3 alcohols; dehydration mechanism","l":1,"d":"2027-01-12","tc":"Pankaj Sijariya Sir"},{"id":"OCH-057","s":"Organic Chemistry","c":"Alcohols Ethers Phenols","t":"Chemical properties of alcohols","l":2,"d":"2027-01-13","tc":"Pankaj Sijariya Sir"},{"id":"OCH-058","s":"Organic Chemistry","c":"Alcohols Ethers Phenols","t":"Preparation of Phenol; Acidic nature; Electrophilic substitution","l":3,"d":"2027-01-14","tc":"Pankaj Sijariya Sir"},{"id":"OCH-059","s":"Organic Chemistry","c":"Alcohols Ethers Phenols","t":"Reimer-Tiemann reaction and Kolbe's Reaction","l":4,"d":"2027-01-16","tc":"Pankaj Sijariya Sir"},{"id":"OCH-060","s":"Organic Chemistry","c":"Alcohols Ethers Phenols","t":"Preparation Structure of Ethers; Epoxides; Physical Properties","l":5,"d":"2027-01-18","tc":"Pankaj Sijariya Sir"},{"id":"OCH-061","s":"Organic Chemistry","c":"Alcohols Ethers Phenols","t":"Question Practice","l":6,"d":"2027-01-19","tc":"Pankaj Sijariya Sir"},{"id":"OCH-062","s":"Organic Chemistry","c":"Aldehydes Ketones Carboxylic Acids","t":"Method of Preparation of Aldehyde and Ketone","l":1,"d":"2027-01-20","tc":"Pankaj Sijariya Sir"},{"id":"OCH-063","s":"Organic Chemistry","c":"Aldehydes Ketones Carboxylic Acids","t":"Method of Preparation of Aldehyde only and Ketone only","l":2,"d":"2027-01-21","tc":"Pankaj Sijariya Sir"},{"id":"OCH-064","s":"Organic Chemistry","c":"Aldehydes Ketones Carboxylic Acids","t":"Nature of carbonyl group; Nucleophilic addition; relative reactivities","l":3,"d":"2027-01-22","tc":"Pankaj Sijariya Sir"},{"id":"OCH-065","s":"Organic Chemistry","c":"Aldehydes Ketones Carboxylic Acids","t":"Cyanohydrin formation; NaHSO3 addition","l":4,"d":"2027-01-23","tc":"Pankaj Sijariya Sir"},{"id":"OCH-066","s":"Organic Chemistry","c":"Aldehydes Ketones Carboxylic Acids","t":"Reaction with Alcohols/NH2Z; Aldol condensation; Cannizzaro reaction","l":5,"d":"2027-01-25","tc":"Pankaj Sijariya Sir"},{"id":"OCH-067","s":"Organic Chemistry","c":"Aldehydes Ketones Carboxylic Acids","t":"Haloform reaction; distinguishing tests; Carboxylic Acid prep and properties","l":6,"d":"2027-01-27","tc":"Pankaj Sijariya Sir"},{"id":"OCH-068","s":"Organic Chemistry","c":"Aldehydes Ketones Carboxylic Acids","t":"Question Practice","l":7,"d":"2027-01-28","tc":"Pankaj Sijariya Sir"},{"id":"OCH-069","s":"Organic Chemistry","c":"Amines","t":"Introduction Structure Classification Nomenclature; basic character","l":1,"d":"2027-01-29","tc":"Pankaj Sijariya Sir"},{"id":"OCH-070","s":"Organic Chemistry","c":"Amines","t":"Preparation; Reactions of Amines and Anilines; Diazonium Salts","l":2,"d":"2027-01-30","tc":"Pankaj Sijariya Sir"},{"id":"OCH-071","s":"Organic Chemistry","c":"Amines","t":"Question Practice","l":3,"d":"2027-02-01","tc":"Pankaj Sijariya Sir"},{"id":"OCH-072","s":"Organic Chemistry","c":"Biomolecules (Organic)","t":"Carbohydrates; Classification; monosaccharides; oligosaccharides","l":1,"d":"2027-02-02","tc":"Pankaj Sijariya Sir"},{"id":"OCH-073","s":"Organic Chemistry","c":"Biomolecules (Organic)","t":"Amino Acids Proteins Nucleic Acids Vitamins Hormones; Question Practice","l":2,"d":"2027-02-03","tc":"Pankaj Sijariya Sir"},{"id":"OCH-074","s":"Organic Chemistry","c":"Purification and Analysis","t":"Purification methods; Qualitative Quantitative analysis; empirical formula; Question Practice","l":1,"d":"2027-02-04","tc":"Pankaj Sijariya Sir"},{"id":"ICH-001","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Introduction; Need for Classification of Elements","l":1,"d":"2026-09-24","tc":"Mohit Dadheech Sir"},{"id":"ICH-002","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Structural part of modern periodic table; electronic configurations","l":2,"d":"2026-09-25","tc":"Mohit Dadheech Sir"},{"id":"ICH-003","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Structural part of periodic table continued","l":3,"d":"2026-09-26","tc":"Mohit Dadheech Sir"},{"id":"ICH-004","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Screening Effect and effective nuclear charge","l":4,"d":"2026-09-28","tc":"Mohit Dadheech Sir"},{"id":"ICH-005","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Atomic Radius","l":5,"d":"2026-09-29","tc":"Mohit Dadheech Sir"},{"id":"ICH-006","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Ionisation Enthalpy","l":6,"d":"2026-09-30","tc":"Mohit Dadheech Sir"},{"id":"ICH-007","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Electron affinity","l":7,"d":"2026-10-01","tc":"Mohit Dadheech Sir"},{"id":"ICH-008","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Electronegativity","l":8,"d":"2026-10-03","tc":"Mohit Dadheech Sir"},{"id":"ICH-009","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Electronegativity continued","l":9,"d":"2026-10-05","tc":"Mohit Dadheech Sir"},{"id":"ICH-010","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Nature of Oxides","l":10,"d":"2026-10-06","tc":"Mohit Dadheech Sir"},{"id":"ICH-011","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Nature of Oxides continued","l":11,"d":"2026-10-07","tc":"Mohit Dadheech Sir"},{"id":"ICH-012","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Historical Development; Question practice","l":12,"d":"2026-10-08","tc":"Mohit Dadheech Sir"},{"id":"ICH-013","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Historical Development continued; Question practice","l":13,"d":"2026-10-09","tc":"Mohit Dadheech Sir"},{"id":"ICH-014","s":"Inorganic Chemistry","c":"Classification of Elements and Periodicity","t":"Question Practice","l":14,"d":"2026-10-10","tc":"Mohit Dadheech Sir"},{"id":"ICH-015","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Kossel-Lewis Approach; Octet Rule","l":1,"d":"2026-10-12","tc":"Mohit Dadheech Sir"},{"id":"ICH-016","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Formal Charge Covalency Coordinate bond","l":2,"d":"2026-10-13","tc":"Mohit Dadheech Sir"},{"id":"ICH-017","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"VSEPR Theory","l":3,"d":"2026-10-14","tc":"Mohit Dadheech Sir"},{"id":"ICH-018","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"VSEPR Theory continued","l":4,"d":"2026-10-15","tc":"Mohit Dadheech Sir"},{"id":"ICH-019","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"VBT; hybridisation applications","l":5,"d":"2026-10-16","tc":"Mohit Dadheech Sir"},{"id":"ICH-020","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"VBT hybridisation continued","l":6,"d":"2026-10-17","tc":"Mohit Dadheech Sir"},{"id":"ICH-021","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Overlapping","l":7,"d":"2026-10-19","tc":"Mohit Dadheech Sir"},{"id":"ICH-022","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Bond identity bond strength orders","l":8,"d":"2026-10-21","tc":"Mohit Dadheech Sir"},{"id":"ICH-023","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Dipole moment","l":9,"d":"2026-10-22","tc":"Mohit Dadheech Sir"},{"id":"ICH-024","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Ionic bond; gen properties of ionic compounds","l":10,"d":"2026-10-23","tc":"Mohit Dadheech Sir"},{"id":"ICH-025","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Lattice energy; Fajans rule","l":11,"d":"2026-10-24","tc":"Mohit Dadheech Sir"},{"id":"ICH-026","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Applications of Fajans rule","l":12,"d":"2026-10-26","tc":"Mohit Dadheech Sir"},{"id":"ICH-027","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"MOT","l":13,"d":"2026-10-27","tc":"Mohit Dadheech Sir"},{"id":"ICH-028","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Hydrogen Bonding","l":14,"d":"2026-10-28","tc":"Mohit Dadheech Sir"},{"id":"ICH-029","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Dipole based forces","l":15,"d":"2026-10-29","tc":"Mohit Dadheech Sir"},{"id":"ICH-030","s":"Inorganic Chemistry","c":"Chemical Bonding and Molecular Structure","t":"Question Practice","l":16,"d":"2026-10-30","tc":"Mohit Dadheech Sir"},{"id":"ICH-031","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Definitions of Important Terms","l":1,"d":"2027-02-05","tc":"Mohit Dadheech Sir"},{"id":"ICH-032","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Classification of Ligands","l":2,"d":"2027-02-06","tc":"Mohit Dadheech Sir"},{"id":"ICH-033","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Nomenclature of Coordination Compounds","l":3,"d":"2027-02-08","tc":"Mohit Dadheech Sir"},{"id":"ICH-034","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Nomenclature continued","l":4,"d":"2027-02-09","tc":"Mohit Dadheech Sir"},{"id":"ICH-035","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Werner Theory and EAN Rule","l":5,"d":"2027-02-10","tc":"Mohit Dadheech Sir"},{"id":"ICH-036","s":"Inorganic Chemistry","c":"Coordination Compound","t":"VBT","l":6,"d":"2027-02-11","tc":"Mohit Dadheech Sir"},{"id":"ICH-037","s":"Inorganic Chemistry","c":"Coordination Compound","t":"VBT continued","l":7,"d":"2027-02-12","tc":"Mohit Dadheech Sir"},{"id":"ICH-038","s":"Inorganic Chemistry","c":"Coordination Compound","t":"CFT","l":8,"d":"2027-02-13","tc":"Mohit Dadheech Sir"},{"id":"ICH-039","s":"Inorganic Chemistry","c":"Coordination Compound","t":"CFT continued","l":9,"d":"2027-02-15","tc":"Mohit Dadheech Sir"},{"id":"ICH-040","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Isomerism in Coordination Compounds","l":10,"d":"2027-02-16","tc":"Mohit Dadheech Sir"},{"id":"ICH-041","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Bonding in Metal Carbonyls","l":11,"d":"2027-02-17","tc":"Mohit Dadheech Sir"},{"id":"ICH-042","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Applications of complexes","l":12,"d":"2027-02-18","tc":"Mohit Dadheech Sir"},{"id":"ICH-043","s":"Inorganic Chemistry","c":"Coordination Compound","t":"Question Practice","l":13,"d":"2027-02-19","tc":"Mohit Dadheech Sir"},{"id":"ICH-044","s":"Inorganic Chemistry","c":"The d and f-Block Elements","t":"General Properties of Transition Elements","l":1,"d":"2027-02-20","tc":"Mohit Dadheech Sir"},{"id":"ICH-045","s":"Inorganic Chemistry","c":"The d and f-Block Elements","t":"General Properties continued","l":2,"d":"2027-02-22","tc":"Mohit Dadheech Sir"},{"id":"ICH-046","s":"Inorganic Chemistry","c":"The d and f-Block Elements","t":"Preparation and properties of KMnO4 and K2Cr2O7","l":3,"d":"2027-02-23","tc":"Mohit Dadheech Sir"},{"id":"ICH-047","s":"Inorganic Chemistry","c":"The d and f-Block Elements","t":"The Lanthanoids and The Actinoids","l":4,"d":"2027-02-24","tc":"Mohit Dadheech Sir"},{"id":"ICH-048","s":"Inorganic Chemistry","c":"The d and f-Block Elements","t":"Question Practice","l":5,"d":"2027-02-25","tc":"Mohit Dadheech Sir"},{"id":"ICH-049","s":"Inorganic Chemistry","c":"The p-Block Elements","t":"Introduction","l":1,"d":"2027-02-26","tc":"Mohit Dadheech Sir"},{"id":"ICH-050","s":"Inorganic Chemistry","c":"The p-Block Elements","t":"Group-13 Group-14","l":2,"d":"2027-02-27","tc":"Mohit Dadheech Sir"},{"id":"ICH-051","s":"Inorganic Chemistry","c":"The p-Block Elements","t":"Group-15 Group-16","l":3,"d":"2027-03-01","tc":"Mohit Dadheech Sir"},{"id":"ICH-052","s":"Inorganic Chemistry","c":"The p-Block Elements","t":"Group-17 Group-18","l":4,"d":"2027-03-02","tc":"Mohit Dadheech Sir"},{"id":"ICH-053","s":"Inorganic Chemistry","c":"The p-Block Elements","t":"Question Practice","l":5,"d":"2027-03-03","tc":"Mohit Dadheech Sir"},{"id":"ICH-054","s":"Inorganic Chemistry","c":"Salt Analysis","t":"Introduction of salt and solubility","l":1,"d":"2027-03-04","tc":"Mohit Dadheech Sir"},{"id":"ICH-055","s":"Inorganic Chemistry","c":"Salt Analysis","t":"Test of Anions; Dry Test and Wet Test of cations","l":2,"d":"2027-03-05","tc":"Mohit Dadheech Sir"},{"id":"ICH-056","s":"Inorganic Chemistry","c":"Salt Analysis","t":"Question Practice","l":3,"d":"2027-03-08","tc":"Mohit Dadheech Sir"},{"id":"ZOO-001","s":"Zoology","c":"Structural Organization in Animals","t":"Tissues; Animal Tissues","l":1,"d":"2026-06-30","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-002","s":"Zoology","c":"Structural Organization in Animals","t":"Epithelium Tissue","l":2,"d":"2026-07-01","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-003","s":"Zoology","c":"Structural Organization in Animals","t":"Epithelium Tissue","l":3,"d":"2026-07-02","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-004","s":"Zoology","c":"Structural Organization in Animals","t":"Cell Junctions","l":4,"d":"2026-07-08","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-005","s":"Zoology","c":"Structural Organization in Animals","t":"Connective Tissue","l":5,"d":"2026-07-09","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-006","s":"Zoology","c":"Structural Organization in Animals","t":"Connective Tissue","l":6,"d":"2026-07-10","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-007","s":"Zoology","c":"Structural Organization in Animals","t":"Muscular Tissue","l":7,"d":"2026-07-15","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-008","s":"Zoology","c":"Structural Organization in Animals","t":"Nervous Tissue; FROG","l":8,"d":"2026-07-16","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-009","s":"Zoology","c":"Structural Organization in Animals","t":"FROG","l":9,"d":"2026-07-17","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-010","s":"Zoology","c":"Structural Organization in Animals","t":"COCKROACH","l":10,"d":"2026-07-22","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-011","s":"Zoology","c":"Structural Organization in Animals","t":"COCKROACH","l":11,"d":"2026-07-23","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-012","s":"Zoology","c":"Structural Organization in Animals","t":"COCKROACH","l":12,"d":"2026-07-24","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-013","s":"Zoology","c":"Structural Organization in Animals","t":"Question Practice","l":13,"d":"2026-07-29","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-014","s":"Zoology","c":"Breathing and Exchange of Gases","t":"Intro; Respiratory organs; Human respiratory system part-1","l":1,"d":"2026-07-30","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-015","s":"Zoology","c":"Breathing and Exchange of Gases","t":"Human respiratory system part-2","l":2,"d":"2026-07-31","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-016","s":"Zoology","c":"Breathing and Exchange of Gases","t":"Mechanism of Breathing; Pulmonary Volumes","l":3,"d":"2026-08-05","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-017","s":"Zoology","c":"Breathing and Exchange of Gases","t":"Pulmonary Capacities; Diffusion; Gas exchange; O2 transport","l":4,"d":"2026-08-06","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-018","s":"Zoology","c":"Breathing and Exchange of Gases","t":"CO2 transport; Hb-O2 dissociation factors","l":5,"d":"2026-08-07","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-019","s":"Zoology","c":"Breathing and Exchange of Gases","t":"Regulation of Respiration; Disorders","l":6,"d":"2026-08-12","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-020","s":"Zoology","c":"Breathing and Exchange of Gases","t":"Question Practice","l":7,"d":"2026-08-13","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-021","s":"Zoology","c":"Body Fluids and Circulation","t":"Intro to body fluids; Blood; Blood formed elements","l":1,"d":"2026-08-14","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-022","s":"Zoology","c":"Body Fluids and Circulation","t":"Blood Groups; Coagulation of Blood","l":2,"d":"2026-08-19","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-023","s":"Zoology","c":"Body Fluids and Circulation","t":"Lymph; Circulatory Pathways; Double Circulation","l":3,"d":"2026-08-20","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-024","s":"Zoology","c":"Body Fluids and Circulation","t":"Coronary Circulation; Human Circulatory System","l":4,"d":"2026-08-21","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-025","s":"Zoology","c":"Body Fluids and Circulation","t":"Cardiac Cycle; Heart Sounds","l":5,"d":"2026-08-26","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-026","s":"Zoology","c":"Body Fluids and Circulation","t":"Blood Vessels; Portal system; ECG","l":6,"d":"2026-08-27","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-027","s":"Zoology","c":"Body Fluids and Circulation","t":"Regulation of Cardiac Activity; Disorders","l":7,"d":"2026-09-02","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-028","s":"Zoology","c":"Body Fluids and Circulation","t":"Question Practice","l":8,"d":"2026-09-03","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-029","s":"Zoology","c":"Excretory Products and their Elimination","t":"Intro; Excretory Structures; Nephron; Urine formation","l":1,"d":"2026-09-04","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-030","s":"Zoology","c":"Excretory Products and their Elimination","t":"Tubule functions; Concentration of filtrate; Micturition","l":2,"d":"2026-09-09","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-031","s":"Zoology","c":"Excretory Products and their Elimination","t":"Regulation of kidney: Hypothalamus/Adrenal cortex/medulla","l":3,"d":"2026-09-10","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-032","s":"Zoology","c":"Excretory Products and their Elimination","t":"Regulation of kidney: Heart; GFR; Disorders","l":4,"d":"2026-09-11","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-033","s":"Zoology","c":"Excretory Products and their Elimination","t":"Disorders of Excretory System; Treatment for renal failure","l":5,"d":"2026-09-16","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-034","s":"Zoology","c":"Excretory Products and their Elimination","t":"Question Practice","l":6,"d":"2026-09-17","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-035","s":"Zoology","c":"Locomotion and Movement","t":"Intro; Locomotory organs; Types of Movement","l":1,"d":"2026-09-18","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-036","s":"Zoology","c":"Locomotion and Movement","t":"Muscles; Types; Skeletal muscles; Contractile proteins","l":2,"d":"2026-09-23","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-037","s":"Zoology","c":"Locomotion and Movement","t":"Mechanism of Muscle Contraction/Relaxation; Red White Muscles","l":3,"d":"2026-09-24","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-038","s":"Zoology","c":"Locomotion and Movement","t":"Skeletal system; Axial and Appendicular skeleton","l":4,"d":"2026-09-25","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-039","s":"Zoology","c":"Locomotion and Movement","t":"Joints; Lever system; Disorders","l":5,"d":"2026-09-30","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-040","s":"Zoology","c":"Locomotion and Movement","t":"Question Practice","l":6,"d":"2026-10-01","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-041","s":"Zoology","c":"Neural Control and Coordination","t":"Intro; Neural system; Human neural system","l":1,"d":"2026-10-07","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-042","s":"Zoology","c":"Neural Control and Coordination","t":"Neuron","l":2,"d":"2026-10-08","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-043","s":"Zoology","c":"Neural Control and Coordination","t":"Generation/conduction of nerve impulse; Transmission","l":3,"d":"2026-10-09","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-044","s":"Zoology","c":"Neural Control and Coordination","t":"Synapse; Mechanism of impulse transmission","l":4,"d":"2026-10-14","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-045","s":"Zoology","c":"Neural Control and Coordination","t":"Neurotransmitters; CNS","l":5,"d":"2026-10-15","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-046","s":"Zoology","c":"Neural Control and Coordination","t":"Human Brain; Spinal cord","l":6,"d":"2026-10-16","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-047","s":"Zoology","c":"Neural Control and Coordination","t":"Question Practice","l":7,"d":"2026-10-21","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-048","s":"Zoology","c":"Chemical Coordination and Integration","t":"Intro; Endocrine glands; Hormones","l":1,"d":"2026-10-22","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-049","s":"Zoology","c":"Chemical Coordination and Integration","t":"Types of hormones; Hypothalamus; Pituitary; Thyroid; Parathyroid","l":2,"d":"2026-10-23","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-050","s":"Zoology","c":"Chemical Coordination and Integration","t":"Thymus; Adrenal cortex/medulla; Pancreas; Gonads","l":3,"d":"2026-10-28","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-051","s":"Zoology","c":"Chemical Coordination and Integration","t":"Testes; Leydig cells; Ovaries; Disorders","l":4,"d":"2026-10-29","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-052","s":"Zoology","c":"Chemical Coordination and Integration","t":"Hormonal action; Heart/Kidney/GI hormones; Feedback","l":5,"d":"2026-10-30","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-053","s":"Zoology","c":"Chemical Coordination and Integration","t":"Question Practice","l":6,"d":"2026-11-04","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-054","s":"Zoology","c":"Animal Kingdom","t":"Intro; Basis of Classification; Porifera; Coelenterata","l":1,"d":"2026-11-05","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-055","s":"Zoology","c":"Animal Kingdom","t":"Ctenophora; Platyhelminthes; Aschelminthes","l":2,"d":"2026-11-12","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-056","s":"Zoology","c":"Animal Kingdom","t":"Annelida; Arthropoda; Mollusca","l":3,"d":"2026-11-13","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-057","s":"Zoology","c":"Animal Kingdom","t":"Echinodermata; Hemichordata; Chordata subphyla; Cyclostomata","l":4,"d":"2026-11-18","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-058","s":"Zoology","c":"Animal Kingdom","t":"Pisces; Amphibia","l":5,"d":"2026-11-19","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-059","s":"Zoology","c":"Animal Kingdom","t":"Reptiles; Aves; Mammalia","l":6,"d":"2026-11-20","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-060","s":"Zoology","c":"Animal Kingdom","t":"Question Practice","l":7,"d":"2026-11-25","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-061","s":"Zoology","c":"Biomolecules","t":"Intro; Method to analyze chemical composition","l":1,"d":"2026-11-26","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-062","s":"Zoology","c":"Biomolecules","t":"Metabolites; Macromolecules; Carbohydrates","l":2,"d":"2026-11-27","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-063","s":"Zoology","c":"Biomolecules","t":"Amino acids; Proteins; Lipids","l":3,"d":"2026-12-02","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-064","s":"Zoology","c":"Biomolecules","t":"Simple/Compound/Derived lipids; Nucleic acids","l":4,"d":"2026-12-03","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-065","s":"Zoology","c":"Biomolecules","t":"RNA DNA; Enzymes","l":5,"d":"2026-12-04","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-066","s":"Zoology","c":"Biomolecules","t":"Question Practice","l":6,"d":"2026-12-09","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-067","s":"Zoology","c":"Human Reproduction","t":"Human reproductive system; Male reproductive system","l":1,"d":"2026-12-10","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-068","s":"Zoology","c":"Human Reproduction","t":"Female reproductive system","l":2,"d":"2026-12-11","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-069","s":"Zoology","c":"Human Reproduction","t":"Gametogenesis; Spermatogenesis","l":3,"d":"2026-12-16","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-070","s":"Zoology","c":"Human Reproduction","t":"Sperm; Structure of sperm","l":4,"d":"2026-12-17","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-071","s":"Zoology","c":"Human Reproduction","t":"Oogenesis; Ovum; Menstrual cycle","l":5,"d":"2026-12-18","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-072","s":"Zoology","c":"Human Reproduction","t":"Fertilisation to Implantation","l":6,"d":"2026-12-23","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-073","s":"Zoology","c":"Human Reproduction","t":"Sex Determination of Foetus","l":7,"d":"2026-12-24","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-074","s":"Zoology","c":"Human Reproduction","t":"Pregnancy and embryonic development; Parturition Lactation","l":8,"d":"2026-12-30","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-075","s":"Zoology","c":"Human Reproduction","t":"Question Practice","l":9,"d":"2026-12-31","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-076","s":"Zoology","c":"Reproductive Health","t":"Reproductive health; Population; Contraceptive methods","l":1,"d":"2027-01-06","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-077","s":"Zoology","c":"Reproductive Health","t":"MTP; STDs","l":2,"d":"2027-01-07","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-078","s":"Zoology","c":"Reproductive Health","t":"Infertility; ARTs","l":3,"d":"2027-01-08","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-079","s":"Zoology","c":"Reproductive Health","t":"Question Practice","l":4,"d":"2027-01-13","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-080","s":"Zoology","c":"Human Health and Diseases","t":"Introduction","l":1,"d":"2027-01-14","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-081","s":"Zoology","c":"Human Health and Diseases","t":"Protozoan Disease; Innate/Acquired Immunity","l":2,"d":"2027-01-20","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-082","s":"Zoology","c":"Human Health and Diseases","t":"Lymphoid organs; Immunisation; Vaccination","l":3,"d":"2027-01-21","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-083","s":"Zoology","c":"Human Health and Diseases","t":"Transplantation; Allergy; Autoimmunity","l":4,"d":"2027-01-22","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-084","s":"Zoology","c":"Human Health and Diseases","t":"Immunodeficiency; Cancer; Drug and Alcohol abuse","l":5,"d":"2027-01-27","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-085","s":"Zoology","c":"Human Health and Diseases","t":"Alcohol/Tobacco abuse; Adolescence; Addiction","l":6,"d":"2027-01-28","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-086","s":"Zoology","c":"Human Health and Diseases","t":"Question Practice","l":7,"d":"2027-01-29","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-087","s":"Zoology","c":"Biotechnology Principles and Processes","t":"Intro; Principles; Genetic engineering","l":1,"d":"2027-02-03","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-088","s":"Zoology","c":"Biotechnology Principles and Processes","t":"Tools of rDNA; Process; Isolation of DNA","l":2,"d":"2027-02-04","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-089","s":"Zoology","c":"Biotechnology Principles and Processes","t":"Separation/isolation of DNA fragments; Vector","l":3,"d":"2027-02-05","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-090","s":"Zoology","c":"Biotechnology Principles and Processes","t":"Amplification; Insertion of rDNA; Foreign gene product","l":4,"d":"2027-02-10","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-091","s":"Zoology","c":"Biotechnology Principles and Processes","t":"Question Practice","l":5,"d":"2027-02-11","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-092","s":"Zoology","c":"Biotechnology and its Applications","t":"Intro; Applications in agriculture","l":1,"d":"2027-02-12","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-093","s":"Zoology","c":"Biotechnology and its Applications","t":"Applications in medicine; Molecular Diagnostics","l":2,"d":"2027-02-17","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-094","s":"Zoology","c":"Biotechnology and its Applications","t":"Transgenic animals; Ethical issues","l":3,"d":"2027-02-18","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-095","s":"Zoology","c":"Biotechnology and its Applications","t":"Question Practice","l":4,"d":"2027-02-19","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-096","s":"Zoology","c":"Evolution","t":"Origin of life; Theory of origin","l":1,"d":"2027-02-24","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-097","s":"Zoology","c":"Evolution","t":"Evolution evidences; Adaptive radiation","l":2,"d":"2027-02-25","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-098","s":"Zoology","c":"Evolution","t":"Theory of organic evolution; Hardy-Weinberg principle","l":3,"d":"2027-02-26","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-099","s":"Zoology","c":"Evolution","t":"Natural and artificial selection","l":4,"d":"2027-03-03","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-100","s":"Zoology","c":"Evolution","t":"Lederberg's experiment; Speciation; Origin of man","l":5,"d":"2027-03-04","tc":"Samapti Sinha Ma'am"},{"id":"ZOO-101","s":"Zoology","c":"Evolution","t":"Question Practice","l":6,"d":"2027-03-05","tc":"Samapti Sinha Ma'am"},{"id":"BOT-001","s":"Botany","c":"Cell - The Unit of Life","t":"What is a Cell; Discovery; Microscopy; Cell Theory","l":1,"d":"2026-06-29","tc":"Vipin Sharma Sir"},{"id":"BOT-002","s":"Botany","c":"Cell - The Unit of Life","t":"Overview of Cell; Types of cell","l":2,"d":"2026-07-03","tc":"Vipin Sharma Sir"},{"id":"BOT-003","s":"Botany","c":"Cell - The Unit of Life","t":"Structure Prokaryotic cell","l":3,"d":"2026-07-04","tc":"Vipin Sharma Sir"},{"id":"BOT-004","s":"Botany","c":"Cell - The Unit of Life","t":"Eukaryotic cells-1","l":4,"d":"2026-07-06","tc":"Vipin Sharma Sir"},{"id":"BOT-005","s":"Botany","c":"Cell - The Unit of Life","t":"Eukaryotic cells-2","l":5,"d":"2026-07-07","tc":"Vipin Sharma Sir"},{"id":"BOT-006","s":"Botany","c":"Cell - The Unit of Life","t":"Eukaryotic cells-3","l":6,"d":"2026-07-11","tc":"Vipin Sharma Sir"},{"id":"BOT-007","s":"Botany","c":"Cell - The Unit of Life","t":"Endosymbiotic Theory","l":7,"d":"2026-07-13","tc":"Vipin Sharma Sir"},{"id":"BOT-008","s":"Botany","c":"Cell - The Unit of Life","t":"Difference Prokaryotic vs Eukaryotic cell","l":8,"d":"2026-07-14","tc":"Vipin Sharma Sir"},{"id":"BOT-009","s":"Botany","c":"Cell - The Unit of Life","t":"Question Practice","l":9,"d":"2026-07-18","tc":"Vipin Sharma Sir"},{"id":"BOT-010","s":"Botany","c":"Cell Cycle and Cell Division","t":"Introduction","l":1,"d":"2026-07-20","tc":"Vipin Sharma Sir"},{"id":"BOT-011","s":"Botany","c":"Cell Cycle and Cell Division","t":"Phases of the Cell Cycle","l":2,"d":"2026-07-21","tc":"Vipin Sharma Sir"},{"id":"BOT-012","s":"Botany","c":"Cell Cycle and Cell Division","t":"Mitosis","l":3,"d":"2026-07-25","tc":"Vipin Sharma Sir"},{"id":"BOT-013","s":"Botany","c":"Cell Cycle and Cell Division","t":"Mitotic Inhibitors","l":4,"d":"2026-07-27","tc":"Vipin Sharma Sir"},{"id":"BOT-014","s":"Botany","c":"Cell Cycle and Cell Division","t":"Special Type of Mitosis; Meiosis","l":5,"d":"2026-07-28","tc":"Vipin Sharma Sir"},{"id":"BOT-015","s":"Botany","c":"Cell Cycle and Cell Division","t":"Types of Meiosis; Nondisjunction","l":6,"d":"2026-08-01","tc":"Vipin Sharma Sir"},{"id":"BOT-016","s":"Botany","c":"Cell Cycle and Cell Division","t":"Question Practice","l":7,"d":"2026-08-03","tc":"Vipin Sharma Sir"},{"id":"BOT-017","s":"Botany","c":"The Living World","t":"Introduction; What is Living","l":1,"d":"2026-08-04","tc":"Vipin Sharma Sir"},{"id":"BOT-018","s":"Botany","c":"The Living World","t":"Diversity in Living World; Taxonomic Categories","l":2,"d":"2026-08-08","tc":"Vipin Sharma Sir"},{"id":"BOT-019","s":"Botany","c":"The Living World","t":"Question Practice","l":3,"d":"2026-08-10","tc":"Vipin Sharma Sir"},{"id":"BOT-020","s":"Botany","c":"Biological Classification","t":"Classification","l":1,"d":"2026-08-11","tc":"Vipin Sharma Sir"},{"id":"BOT-021","s":"Botany","c":"Biological Classification","t":"Kingdom Monera","l":2,"d":"2026-08-17","tc":"Vipin Sharma Sir"},{"id":"BOT-022","s":"Botany","c":"Biological Classification","t":"Kingdom Protista; Kingdom Fungi","l":3,"d":"2026-08-18","tc":"Vipin Sharma Sir"},{"id":"BOT-023","s":"Botany","c":"Biological Classification","t":"Kingdom Plantae/Animalia; Symbiotic Associations","l":4,"d":"2026-08-22","tc":"Vipin Sharma Sir"},{"id":"BOT-024","s":"Botany","c":"Biological Classification","t":"Viruses; Prions; Viroids","l":5,"d":"2026-08-24","tc":"Vipin Sharma Sir"},{"id":"BOT-025","s":"Botany","c":"Biological Classification","t":"Question Practice","l":6,"d":"2026-08-25","tc":"Vipin Sharma Sir"},{"id":"BOT-026","s":"Botany","c":"Plant Kingdom","t":"Introduction","l":1,"d":"2026-08-29","tc":"Vipin Sharma Sir"},{"id":"BOT-027","s":"Botany","c":"Plant Kingdom","t":"Types of Classification Systems","l":2,"d":"2026-08-31","tc":"Vipin Sharma Sir"},{"id":"BOT-028","s":"Botany","c":"Plant Kingdom","t":"Algae","l":3,"d":"2026-09-01","tc":"Vipin Sharma Sir"},{"id":"BOT-029","s":"Botany","c":"Plant Kingdom","t":"Bryophytes","l":4,"d":"2026-09-05","tc":"Vipin Sharma Sir"},{"id":"BOT-030","s":"Botany","c":"Plant Kingdom","t":"Pteridophytes","l":5,"d":"2026-09-07","tc":"Vipin Sharma Sir"},{"id":"BOT-031","s":"Botany","c":"Plant Kingdom","t":"Gymnosperms","l":6,"d":"2026-09-08","tc":"Vipin Sharma Sir"},{"id":"BOT-032","s":"Botany","c":"Plant Kingdom","t":"Question Practice","l":7,"d":"2026-09-12","tc":"Vipin Sharma Sir"},{"id":"BOT-033","s":"Botany","c":"Morphology of Flowering Plants","t":"Introduction","l":1,"d":"2026-09-15","tc":"Vipin Sharma Sir"},{"id":"BOT-034","s":"Botany","c":"Morphology of Flowering Plants","t":"The Root","l":2,"d":"2026-09-19","tc":"Vipin Sharma Sir"},{"id":"BOT-035","s":"Botany","c":"Morphology of Flowering Plants","t":"The Stem; The Leaf","l":3,"d":"2026-09-21","tc":"Vipin Sharma Sir"},{"id":"BOT-036","s":"Botany","c":"Morphology of Flowering Plants","t":"Inflorescence; Flower parts; Seed and Fruit","l":4,"d":"2026-09-22","tc":"Vipin Sharma Sir"},{"id":"BOT-037","s":"Botany","c":"Morphology of Flowering Plants","t":"Semi-technical description; Important families","l":5,"d":"2026-09-26","tc":"Vipin Sharma Sir"},{"id":"BOT-038","s":"Botany","c":"Morphology of Flowering Plants","t":"Question Practice","l":6,"d":"2026-09-28","tc":"Vipin Sharma Sir"},{"id":"BOT-039","s":"Botany","c":"Anatomy of Flowering Plants","t":"Introduction; Meristematic Tissues","l":1,"d":"2026-09-29","tc":"Vipin Sharma Sir"},{"id":"BOT-040","s":"Botany","c":"Anatomy of Flowering Plants","t":"Permanent Tissues; Tissue System","l":2,"d":"2026-10-03","tc":"Vipin Sharma Sir"},{"id":"BOT-041","s":"Botany","c":"Anatomy of Flowering Plants","t":"Dicot/Monocot Roots","l":3,"d":"2026-10-05","tc":"Vipin Sharma Sir"},{"id":"BOT-042","s":"Botany","c":"Anatomy of Flowering Plants","t":"Dicot/Monocot Stem","l":4,"d":"2026-10-06","tc":"Vipin Sharma Sir"},{"id":"BOT-043","s":"Botany","c":"Anatomy of Flowering Plants","t":"Dicot/Monocot Leaf","l":5,"d":"2026-10-10","tc":"Vipin Sharma Sir"},{"id":"BOT-044","s":"Botany","c":"Anatomy of Flowering Plants","t":"Question Practice","l":6,"d":"2026-10-12","tc":"Vipin Sharma Sir"},{"id":"BOT-045","s":"Botany","c":"Respiration in Plants","t":"Introduction; Glycolysis EMP pathway","l":1,"d":"2026-10-13","tc":"Vipin Sharma Sir"},{"id":"BOT-046","s":"Botany","c":"Respiration in Plants","t":"Fermentation","l":2,"d":"2026-10-17","tc":"Vipin Sharma Sir"},{"id":"BOT-047","s":"Botany","c":"Respiration in Plants","t":"Aerobic respiration","l":3,"d":"2026-10-19","tc":"Vipin Sharma Sir"},{"id":"BOT-048","s":"Botany","c":"Respiration in Plants","t":"Respiratory Balance Sheet; Amphibolic Pathway","l":4,"d":"2026-10-24","tc":"Vipin Sharma Sir"},{"id":"BOT-049","s":"Botany","c":"Respiration in Plants","t":"Respiratory Quotient","l":5,"d":"2026-10-26","tc":"Vipin Sharma Sir"},{"id":"BOT-050","s":"Botany","c":"Respiration in Plants","t":"Question Practice","l":6,"d":"2026-10-27","tc":"Vipin Sharma Sir"},{"id":"BOT-051","s":"Botany","c":"Photosynthesis in Higher Plants","t":"Introduction; Early Experiments","l":1,"d":"2026-10-31","tc":"Vipin Sharma Sir"},{"id":"BOT-052","s":"Botany","c":"Photosynthesis in Higher Plants","t":"Site of Photosynthesis; Pigments","l":2,"d":"2026-11-02","tc":"Vipin Sharma Sir"},{"id":"BOT-053","s":"Botany","c":"Photosynthesis in Higher Plants","t":"Light Reaction; Electron Transport Chain","l":3,"d":"2026-11-03","tc":"Vipin Sharma Sir"},{"id":"BOT-054","s":"Botany","c":"Photosynthesis in Higher Plants","t":"ATP NADPH use; Calvin Cycle; Hatch-Slack; Photorespiration","l":4,"d":"2026-11-10","tc":"Vipin Sharma Sir"},{"id":"BOT-055","s":"Botany","c":"Photosynthesis in Higher Plants","t":"C3 vs C4; CAM pathway; Factors affecting photosynthesis","l":5,"d":"2026-11-14","tc":"Vipin Sharma Sir"},{"id":"BOT-056","s":"Botany","c":"Photosynthesis in Higher Plants","t":"Question Practice","l":6,"d":"2026-11-17","tc":"Vipin Sharma Sir"},{"id":"BOT-057","s":"Botany","c":"Plant Growth and Development","t":"Intro; Seed Germination; Growth","l":1,"d":"2026-11-21","tc":"Vipin Sharma Sir"},{"id":"BOT-058","s":"Botany","c":"Plant Growth and Development","t":"Differentiation Dedifferentiation Redifferentiation Development","l":2,"d":"2026-11-23","tc":"Vipin Sharma Sir"},{"id":"BOT-059","s":"Botany","c":"Plant Growth and Development","t":"Plant Growth Regulators","l":3,"d":"2026-11-24","tc":"Vipin Sharma Sir"},{"id":"BOT-060","s":"Botany","c":"Plant Growth and Development","t":"Question Practice","l":4,"d":"2026-11-28","tc":"Vipin Sharma Sir"},{"id":"BOT-061","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Flower organ of Angiosperms; Pre-fertilization events-1","l":1,"d":"2026-11-30","tc":"Vipin Sharma Sir"},{"id":"BOT-062","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Pre-Fertilization Structures and Events","l":2,"d":"2026-12-01","tc":"Vipin Sharma Sir"},{"id":"BOT-063","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Pollination; Incompatibility; Pollen-pistil interaction","l":3,"d":"2026-12-05","tc":"Vipin Sharma Sir"},{"id":"BOT-064","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Artificial Hybridization; Double Fertilization","l":4,"d":"2026-12-07","tc":"Vipin Sharma Sir"},{"id":"BOT-065","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Post-Fertilisation Structures and Events","l":5,"d":"2026-12-08","tc":"Vipin Sharma Sir"},{"id":"BOT-066","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Post-Fertilisation Structures and Events","l":6,"d":"2026-12-12","tc":"Vipin Sharma Sir"},{"id":"BOT-067","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Seed; Fruit","l":7,"d":"2026-12-14","tc":"Vipin Sharma Sir"},{"id":"BOT-068","s":"Botany","c":"Sexual Reproduction in Flowering Plant","t":"Question Practice","l":8,"d":"2026-12-15","tc":"Vipin Sharma Sir"},{"id":"BOT-069","s":"Botany","c":"Molecular Basis of Inheritance","t":"Introduction; The DNA","l":1,"d":"2026-12-19","tc":"Vipin Sharma Sir"},{"id":"BOT-070","s":"Botany","c":"Molecular Basis of Inheritance","t":"Central Dogma","l":2,"d":"2026-12-21","tc":"Vipin Sharma Sir"},{"id":"BOT-071","s":"Botany","c":"Molecular Basis of Inheritance","t":"Packaging of DNA Helix; Search for Genetic Material","l":3,"d":"2026-12-22","tc":"Vipin Sharma Sir"},{"id":"BOT-072","s":"Botany","c":"Molecular Basis of Inheritance","t":"RNA world; DNA Replication; DNA Repair","l":4,"d":"2026-12-26","tc":"Vipin Sharma Sir"},{"id":"BOT-073","s":"Botany","c":"Molecular Basis of Inheritance","t":"Transcription; Post Transcriptional Process","l":5,"d":"2026-12-28","tc":"Vipin Sharma Sir"},{"id":"BOT-074","s":"Botany","c":"Molecular Basis of Inheritance","t":"Genetic Code","l":6,"d":"2026-12-29","tc":"Vipin Sharma Sir"},{"id":"BOT-075","s":"Botany","c":"Molecular Basis of Inheritance","t":"tRNA; Translation","l":7,"d":"2027-01-02","tc":"Vipin Sharma Sir"},{"id":"BOT-076","s":"Botany","c":"Molecular Basis of Inheritance","t":"Regulation of Gene Expression","l":8,"d":"2027-01-04","tc":"Vipin Sharma Sir"},{"id":"BOT-077","s":"Botany","c":"Molecular Basis of Inheritance","t":"Human Genome Project","l":9,"d":"2027-01-05","tc":"Vipin Sharma Sir"},{"id":"BOT-078","s":"Botany","c":"Molecular Basis of Inheritance","t":"DNA Analysis Methods; Blotting; DNA Fingerprinting","l":10,"d":"2027-01-09","tc":"Vipin Sharma Sir"},{"id":"BOT-079","s":"Botany","c":"Molecular Basis of Inheritance","t":"Question Practice","l":11,"d":"2027-01-11","tc":"Vipin Sharma Sir"},{"id":"BOT-080","s":"Botany","c":"Principle of Inheritance and Variation","t":"Introduction; Genetic Terminology","l":1,"d":"2027-01-12","tc":"Vipin Sharma Sir"},{"id":"BOT-081","s":"Botany","c":"Principle of Inheritance and Variation","t":"Mendel's Experiments; Inheritance of One Gene","l":2,"d":"2027-01-16","tc":"Vipin Sharma Sir"},{"id":"BOT-082","s":"Botany","c":"Principle of Inheritance and Variation","t":"Mendel's Laws of Inheritance","l":3,"d":"2027-01-18","tc":"Vipin Sharma Sir"},{"id":"BOT-083","s":"Botany","c":"Principle of Inheritance and Variation","t":"Exceptions to Mendelian Principles","l":4,"d":"2027-01-19","tc":"Vipin Sharma Sir"},{"id":"BOT-084","s":"Botany","c":"Principle of Inheritance and Variation","t":"Inheritance of Two Genes","l":5,"d":"2027-01-23","tc":"Vipin Sharma Sir"},{"id":"BOT-085","s":"Botany","c":"Principle of Inheritance and Variation","t":"Polygenic Inheritance and Pleiotropy","l":6,"d":"2027-01-25","tc":"Vipin Sharma Sir"},{"id":"BOT-086","s":"Botany","c":"Principle of Inheritance and Variation","t":"Post-Mendelism","l":7,"d":"2027-01-30","tc":"Vipin Sharma Sir"},{"id":"BOT-087","s":"Botany","c":"Principle of Inheritance and Variation","t":"Sex Determination","l":8,"d":"2027-02-01","tc":"Vipin Sharma Sir"},{"id":"BOT-088","s":"Botany","c":"Principle of Inheritance and Variation","t":"Mutation","l":9,"d":"2027-02-02","tc":"Vipin Sharma Sir"},{"id":"BOT-089","s":"Botany","c":"Principle of Inheritance and Variation","t":"Genetic Disorders: Mendelian","l":10,"d":"2027-02-06","tc":"Vipin Sharma Sir"},{"id":"BOT-090","s":"Botany","c":"Principle of Inheritance and Variation","t":"Genetic Disorders: Chromosomal","l":11,"d":"2027-02-08","tc":"Vipin Sharma Sir"},{"id":"BOT-091","s":"Botany","c":"Principle of Inheritance and Variation","t":"Cytoplasmic Inheritance; Dosage Compensation","l":12,"d":"2027-02-09","tc":"Vipin Sharma Sir"},{"id":"BOT-092","s":"Botany","c":"Principle of Inheritance and Variation","t":"Question Practice","l":13,"d":"2027-02-13","tc":"Vipin Sharma Sir"},{"id":"BOT-093","s":"Botany","c":"Microbes in Human Welfare","t":"Intro; Household products; Sewage; Biogas; Organic farming; Biofertilizers; Biocontrol","l":1,"d":"2027-02-15","tc":"Vipin Sharma Sir"},{"id":"BOT-094","s":"Botany","c":"Microbes in Human Welfare","t":"Question Practice","l":2,"d":"2027-02-16","tc":"Vipin Sharma Sir"},{"id":"BOT-095","s":"Botany","c":"Organisms and Population","t":"Intro; Levels of Organisation; Organism and Environment","l":1,"d":"2027-02-20","tc":"Vipin Sharma Sir"},{"id":"BOT-096","s":"Botany","c":"Organisms and Population","t":"Responses to Abiotic Factors; Adaptations; Populations","l":2,"d":"2027-02-22","tc":"Vipin Sharma Sir"},{"id":"BOT-097","s":"Botany","c":"Organisms and Population","t":"Population Growth Models; Carrying Capacity; Interactions","l":3,"d":"2027-02-23","tc":"Vipin Sharma Sir"},{"id":"BOT-098","s":"Botany","c":"Organisms and Population","t":"Question Practice","l":4,"d":"2027-02-27","tc":"Vipin Sharma Sir"},{"id":"BOT-099","s":"Botany","c":"Ecosystem","t":"Intro; Major Ecosystems; Structure Function; Food Chain Web; Pyramids","l":1,"d":"2027-03-01","tc":"Vipin Sharma Sir"},{"id":"BOT-100","s":"Botany","c":"Ecosystem","t":"Question Practice","l":2,"d":"2027-03-02","tc":"Vipin Sharma Sir"},{"id":"BOT-101","s":"Botany","c":"Biodiversity and Conservation","t":"Biodiversity; Loss of Biodiversity","l":1,"d":"2027-03-08","tc":"Vipin Sharma Sir"},{"id":"BOT-102","s":"Botany","c":"Biodiversity and Conservation","t":"Question Practice","l":2,"d":"2027-03-09","tc":"Vipin Sharma Sir"}];

/* ---------------- Constants ---------------- */
const CUTOFF = "2026-08-20";               // backlog = aired on/before this date
let BACKLOG_SCHED_START = "2026-08-20";  // day backlog clearing begins (user-configurable, Phase 4)
const EXAM_DATE_DEFAULT = "2027-05-04";
const NCERT_R8_TARGET = "2027-03-07";      // "1st week of March 2027"

const SUBJECT_ORDER = ["Physics", "Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Zoology", "Botany"];

const SUBJECT_STYLE = {
  "Physics":            { accent: "#3B82F6", label: "PHY", emoji: "⚡" },
  "Physical Chemistry": { accent: "#14B8A6", label: "P.CHEM", emoji: "🧪" },
  "Organic Chemistry":  { accent: "#2DD4BF", label: "O.CHEM", emoji: "🧫" },
  "Inorganic Chemistry":{ accent: "#0D9488", label: "I.CHEM", emoji: "⚗️" },
  "Zoology":            { accent: "#22C55E", label: "ZOO", emoji: "🐾" },
  "Botany":             { accent: "#4ADE80", label: "BOT", emoji: "🌿" },
};
const REVISION_GOLD = "#EAB308";
const URGENT_RED = "#EF4444";
// These resolve via CSS custom properties set on the app root, so every
// component already referencing them follows the active theme automatically.
const NAVY_BG = "var(--bg)";
const NAVY_CARD = "var(--card)";
const NAVY_CARD2 = "var(--card2)";

const THEMES = {
  dark: {
    bg: "#0B1220", card: "#111A2E", card2: "#16213A",
    text: "#F1F5F9", textDim: "#94A3B8", textMuted: "#64748B",
    border: "#2A3652", border2: "#1E293B", inputBg: "#0B1220", navBg: "#0F1729",
  },
  light: {
    bg: "#F3F5FA", card: "#FFFFFF", card2: "#F3F6FB",
    text: "#0F172A", textDim: "#475569", textMuted: "#64748B",
    border: "#D8E0EC", border2: "#E6EBF3", inputBg: "#FFFFFF", navBg: "#FFFFFF",
  },
};
const LECTURE_MIN = 150;

/* ---------------- Date helpers (all LOCAL-time safe — no UTC conversion,
   which previously caused a day to shift backward for IST users) ---------------- */
function pad2(n) { return String(n).padStart(2, "0"); }
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function fmtDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
}
function dayName(iso) { return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" }); }
function isSunday(iso) { return new Date(iso + "T00:00:00").getDay() === 0; }
function addDays(iso, n) {
  const [y, m, day] = iso.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function daysBetween(a, b) { return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000); }

/* ============================================================
   BACKLOG SCHEDULING ENGINE
   Rule: Mon-Sat = 2 backlog lectures/day, Sunday = 3/day.
   Subjects strictly sequential — one subject's backlog fully
   scheduled before the next subject begins.

   PHASE 4: start date and daily quota are now user-configurable
   (via Settings → Planner). recomputeBacklogSchedule() rebuilds
   these module-level values in place; every function/component
   that already reads BACKLOG_TASKS / BACKLOG_BY_SUBJECT keeps
   working unchanged and simply sees the updated schedule on the
   next render — this only changes future scheduling, never
   touches taskStates (so completed lectures are never affected).
   ============================================================ */
const RAW_BACKLOG = PLANNER.filter(t => t.d <= CUTOFF);
const RAW_LIVE = PLANNER.filter(t => t.d > CUTOFF);

let WEEKDAY_QUOTA = 2;
let SUNDAY_QUOTA = 3;

function buildBacklogSchedule() {
  // Group by subject, preserve planner order (already chapter/date sequential)
  const bySubj = {};
  SUBJECT_ORDER.forEach(s => { bySubj[s] = RAW_BACKLOG.filter(t => t.s === s); });

  const scheduled = [];
  let cursorDate = BACKLOG_SCHED_START;
  let usedToday = 0;
  let quotaToday = isSunday(cursorDate) ? SUNDAY_QUOTA : WEEKDAY_QUOTA;

  SUBJECT_ORDER.forEach(subj => {
    bySubj[subj].forEach(task => {
      if (usedToday >= quotaToday) {
        cursorDate = addDays(cursorDate, 1);
        usedToday = 0;
        quotaToday = isSunday(cursorDate) ? SUNDAY_QUOTA : WEEKDAY_QUOTA;
      }
      scheduled.push({ ...task, scheduledDate: cursorDate, priority: "Medium" });
      usedToday++;
    });
  });
  return scheduled;
}

let BACKLOG_TASKS = buildBacklogSchedule();
const BACKLOG_BY_SUBJECT = {};
SUBJECT_ORDER.forEach(s => { BACKLOG_BY_SUBJECT[s] = BACKLOG_TASKS.filter(t => t.s === s); });

const LIVE_BY_SUBJECT = {};
SUBJECT_ORDER.forEach(s => {
  LIVE_BY_SUBJECT[s] = RAW_LIVE.filter(t => t.s === s).sort((a, b) => a.d.localeCompare(b.d) || a.l - b.l);
});

function groupByChapter(tasks) {
  const map = {};
  tasks.forEach(t => { (map[t.c] = map[t.c] || []).push(t); });
  return map;
}

let ALL_BACKLOG_END_DATE = BACKLOG_TASKS.length ? BACKLOG_TASKS[BACKLOG_TASKS.length - 1].scheduledDate : BACKLOG_SCHED_START;

// Recomputes the personalized backlog schedule from a chosen start date and
// daily quota. Only affects scheduledDate on not-yet-scheduled distribution —
// existing completion/proof/notes data in taskStates is never touched.
function recomputeBacklogSchedule(startDate, weekdayQuota, sundayQuota) {
  BACKLOG_SCHED_START = startDate;
  WEEKDAY_QUOTA = weekdayQuota;
  SUNDAY_QUOTA = sundayQuota;
  BACKLOG_TASKS = buildBacklogSchedule();
  SUBJECT_ORDER.forEach(s => { BACKLOG_BY_SUBJECT[s] = BACKLOG_TASKS.filter(t => t.s === s); });
  ALL_BACKLOG_END_DATE = BACKLOG_TASKS.length ? BACKLOG_TASKS[BACKLOG_TASKS.length - 1].scheduledDate : BACKLOG_SCHED_START;
}

function previewBacklogSchedule(startDate, weekdayQuota, sundayQuota) {
  const savedStart = BACKLOG_SCHED_START, savedW = WEEKDAY_QUOTA, savedS = SUNDAY_QUOTA;
  BACKLOG_SCHED_START = startDate; WEEKDAY_QUOTA = weekdayQuota; SUNDAY_QUOTA = sundayQuota;
  const tasks = buildBacklogSchedule();
  BACKLOG_SCHED_START = savedStart; WEEKDAY_QUOTA = savedW; SUNDAY_QUOTA = savedS;
  return { total: tasks.length, endDate: tasks.length ? tasks[tasks.length - 1].scheduledDate : startDate };
}

/* ============================================================
   DYNAMIC ROLLOVER — the "next day it becomes backlog" rule.
   A live-class lecture whose date has already passed (< today)
   and is not yet completed is treated as backlog from that day
   onward — it shows up in the Backlog section automatically,
   and disappears from the Live section, without any manual step.
   Recomputed live every render using the real current date, so
   it advances on its own each day the app is opened.
   ============================================================ */
function rolledOverForSubject(subj, today, isDoneFn) {
  return LIVE_BY_SUBJECT[subj]
    .filter(t => t.d < today && !isDoneFn(t))
    .map(t => ({ ...t, rolledOver: true }));
}
function effectiveBacklogForSubject(subj, today, isDoneFn) {
  return [...BACKLOG_BY_SUBJECT[subj], ...rolledOverForSubject(subj, today, isDoneFn)];
}
function liveRemainingForSubject(subj, today) {
  return LIVE_BY_SUBJECT[subj].filter(t => t.d >= today);
}

/* ---------------- UI atoms ---------------- */
function TickBox({ checked, size = 22, color = "#22C55E" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      border: `2px solid ${checked ? color : "var(--border)"}`,
      background: checked ? color : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
    }}>
      {checked && <CheckCircle2 size={size - 6} color="var(--input-bg)" strokeWidth={3} />}
    </div>
  );
}
function ProgressBar({ pct, color = "#3B82F6", height = 8 }) {
  return (
    <div style={{ width: "100%", height, background: "var(--border2)", borderRadius: height }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: "100%", background: color, borderRadius: height, transition: "width .3s" }} />
    </div>
  );
}
function ProgressRing({ pct, size = 64, stroke = 7, color = "#3B82F6" }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c - (Math.min(100, pct) / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border2)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .4s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 700, color: "#fff" }}>{Math.round(pct)}%</span>
      </div>
    </div>
  );
}
function SectionHeader({ icon, title, count, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0 8px" }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", letterSpacing: 0.3 }}>{title}</span>
      {count !== undefined && (
        <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color, background: `${color}22`, padding: "2px 9px", borderRadius: 20 }}>{count}</span>
      )}
    </div>
  );
}
function EmptyNote({ text }) { return <div style={{ color: "var(--text-muted)", fontSize: 13, padding: "14px 4px" }}>{text}</div>; }
function Pill({ text, color }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}22`, padding: "2px 7px", borderRadius: 6 }}>{text}</span>;
}

/* ---------------- Task Card ---------------- */
function TaskCard({ task, state, onToggle, onHours, badge, badgeColor, showTiming, onOpenDetail }) {
  const style = SUBJECT_STYLE[task.s];
  const st = state || {};
  const allDone = st.video && st.dpp && st.notes;
  const isSkipped = st.status === "Skipped";
  const proofBlocking = !!st.requireProof && !(st.proofImages && st.proofImages.length > 0) && !allDone;
  const isBacklog = !!task.scheduledDate;
  const effBadge = isSkipped ? "SKIPPED" : task.rolledOver ? "MISSED LIVE → BACKLOG" : badge;
  const effBadgeColor = isSkipped ? "var(--text-muted)" : task.rolledOver ? URGENT_RED : badgeColor;
  return (
    <div style={{
      background: NAVY_CARD2, borderRadius: 14, padding: "12px 14px", marginBottom: 10,
      borderLeft: `4px solid ${task.rolledOver ? URGENT_RED : style.accent}`, opacity: (allDone || isSkipped) ? 0.55 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
        <Pill text={`${style.emoji} ${style.label}`} color={style.accent} />
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>L{task.l}</span>
        {effBadge && <span style={{ fontSize: 10, fontWeight: 700, color: effBadgeColor || URGENT_RED, marginLeft: effBadge ? 4 : "auto" }}>{effBadge}</span>}
        {onOpenDetail && (
          <button onClick={() => onOpenDetail(task)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 20, padding: "1px 7px" }}>Details</span>
          </button>
        )}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 1 }}>{task.c}</div>
      <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, lineHeight: 1.3 }}>{task.t}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
        {task.tc} · {LECTURE_MIN}min{task.startTime ? ` · ${task.startTime}-${task.endTime}` : ""}
      </div>
      <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 3, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <span>📋 Planner date: <b style={{ color: "var(--text-dim)" }}>{fmtDate(task.d)}</b></span>
        {isBacklog && <span>📅 Scheduled: <b style={{ color: REVISION_GOLD }}>{fmtDate(task.scheduledDate)}</b></span>}
        {st.carryForwardCount > 0 && <span style={{ color: URGENT_RED }}>↪️ Carried forward ×{st.carryForwardCount}</span>}
        {proofBlocking && <span style={{ color: REVISION_GOLD }}>🔒 proof required — open Details</span>}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
        {["video", "dpp", "notes"].map(k => (
          <button key={k} onClick={() => onToggle(task, k)} disabled={k === "video" && proofBlocking} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, cursor: (k === "video" && proofBlocking) ? "not-allowed" : "pointer", opacity: (k === "video" && proofBlocking) ? 0.4 : 1 }}>
            <TickBox checked={!!st[k]} size={19} color={style.accent} />
            <span style={{ fontSize: 11, color: st[k] ? "var(--text)" : "var(--text-muted)" }}>{k === "video" ? "Video" : k === "dpp" ? "DPP" : "Notes"}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <Clock size={13} color="var(--text-muted)" />
        <input type="number" step="0.25" min="0" placeholder="Actual hours" value={st.actualHours || ""}
          onChange={e => onHours && onHours(task, parseFloat(e.target.value) || 0)}
          style={{ width: 90, background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 11 }} />
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>hrs spent on this lecture</span>
      </div>
      {st.telegramLink && (
        <a href={st.telegramLink} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 11, fontWeight: 700,
          color: "#3B82F6", textDecoration: "none", background: "#3B82F618", padding: "5px 10px", borderRadius: 8
        }}>📺 Watch / Download on Telegram</a>
      )}
    </div>
  );
}

/* ============================================================
   ENGINE — missed-live processing & carry-forward derivation
   Idempotent: re-running never creates duplicate records.
   ============================================================ */
function computeIsDone(taskState) {
  return !!(taskState && taskState.video && taskState.dpp && taskState.notes);
}

// Scans live tasks whose date has passed (< today) and are not
// done; creates a missed_live record if one doesn't already
// exist for that originalTaskId (idempotent).
function processMissedLive(today, missedRecords, taskStates, pushHistory) {
  const existingIds = new Set(missedRecords.map(m => m.originalTaskId));
  const newRecords = [];
  RAW_LIVE.forEach(task => {
    if (task.d < today && !computeIsDone(taskStates[task.id]) && !existingIds.has(task.id)) {
      const rec = {
        taskId: `MISS-${task.id}`,
        originalTaskId: task.id,
        subject: task.s, chapter: task.c, topic: task.t, teacher: task.tc,
        originalDate: task.d, originalTiming: task.startTime ? `${task.startTime}-${task.endTime}` : "",
        missedDate: task.d, newScheduledDate: today, status: "MISSED",
        createdAt: new Date().toISOString(),
      };
      newRecords.push(rec);
      pushHistory(`🟠 MISSED — ${task.s} L${task.l}: ${task.t} (was ${fmtDate(task.d)})`);
    }
  });
  return newRecords.length ? [...missedRecords, ...newRecords] : missedRecords;
}

// Unified carry-forward = overdue backlog (scheduledDate < today, not done)
// + open missed-live records (not done).
function deriveCarryForward(today, taskStates, missedRecords) {
  const overdueBacklog = BACKLOG_TASKS.filter(t => t.scheduledDate < today && !computeIsDone(taskStates[t.id]));
  const openMissed = missedRecords.filter(m => !computeIsDone(taskStates[m.originalTaskId]));
  return { overdueBacklog, openMissed };
}

function nextBacklogQueue(taskStates, limit, today) {
  const isDone = (t) => computeIsDone(taskStates[t.id]);
  for (const subj of SUBJECT_ORDER) {
    const pending = effectiveBacklogForSubject(subj, today, isDone).filter(t => !isDone(t));
    if (pending.length > 0) return { subject: subj, tasks: pending.slice(0, limit) };
  }
  return { subject: null, tasks: [] };
}

/* ============================================================
   ADAPTIVE CATCH-UP LOGIC
   If pending backlog for the active subject > 4 lectures, spread
   it across the next 5 days with a +0.5 lecture/day increment
   instead of dumping it all today — reduces burnout risk.
   ============================================================ */
function adaptiveCatchUpPlan(pendingCount) {
  if (pendingCount <= 4) return null;
  let base = Math.max(1, (pendingCount - 5) / 5);
  base = Math.round(base * 2) / 2;
  const plan = [];
  for (let i = 0; i < 5; i++) plan.push(Math.round((base + 0.5 * i) * 2) / 2);
  return plan;
}

/* ============================================================
   BURNOUT PREVENTION
   Tracks daily pending-backlog totals. If it has strictly grown
   for 3 consecutive recorded days, the next day auto-becomes a
   Buffer & Recovery Day — no new lectures assigned that day.
   ============================================================ */
function checkBurnoutTrend(backlogTrend, today) {
  const d1 = addDays(today, -1), d2 = addDays(today, -2), d3 = addDays(today, -3);
  const v0 = backlogTrend[today], v1 = backlogTrend[d1], v2 = backlogTrend[d2], v3 = backlogTrend[d3];
  if (v1 == null || v2 == null || v3 == null) return false;
  return v1 > v2 && v2 > v3; // grew for 3 straight recorded days
}

/* ============================================================
   SPACED REPETITION (3 / 7 / 30 day reminders)
   Computed live from each task's completedAt — no separate
   schedule to maintain, and nothing is generated until a task
   is actually completed.
   ============================================================ */
const SPACED_INTERVALS = [3, 7, 30];
function computeSpacedDue(taskStates, spacedStates, today) {
  const due = [];
  Object.entries(taskStates).forEach(([id, st]) => {
    if (!st.completedAt) return;
    const completedDate = st.completedAt.slice(0, 10);
    SPACED_INTERVALS.forEach(interval => {
      const dueDate = addDays(completedDate, interval);
      const flagKey = `r${interval}`;
      if (dueDate <= today && !(spacedStates[id] && spacedStates[id][flagKey])) {
        const task = PLANNER.find(t => t.id === id);
        if (task) due.push({ task, interval, dueDate });
      }
    });
  });
  return due.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

/* ============================================================
   STREAK & GAMIFICATION
   Daily goal = at least 2 lecture completions that day AND at
   least one NCERT / PYQ / Revision completion that same day.
   ============================================================ */
function wasGoalMetOnDate(date, taskStates, ncertStates, revisionStates, pyqStates) {
  const lecturesThatDay = Object.values(taskStates).filter(st => st.completedAt && st.completedAt.slice(0, 10) === date).length;
  const ncertThatDay = Object.values(ncertStates).some(st => st.completedAt && st.completedAt.slice(0, 10) === date);
  const revisionThatDay = Object.values(revisionStates).some(st => st.completedAt && st.completedAt.slice(0, 10) === date);
  const pyqThatDay = Object.values(pyqStates).some(st => st.completedAt && st.completedAt.slice(0, 10) === date);
  return lecturesThatDay >= 2 && (ncertThatDay || revisionThatDay || pyqThatDay);
}
function computeStreak(today, taskStates, ncertStates, revisionStates, pyqStates) {
  let streak = 0;
  let cursor = wasGoalMetOnDate(today, taskStates, ncertStates, revisionStates, pyqStates) ? today : addDays(today, -1);
  const todayCounted = cursor === today;
  while (wasGoalMetOnDate(cursor, taskStates, ncertStates, revisionStates, pyqStates)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return { streak, todayCounted };
}
function streakBadge(streak) {
  if (streak >= 30) return "🏆 Monthly Champion";
  if (streak >= 14) return "💪 Two-Week Grinder";
  if (streak >= 7) return "⭐ Week Warrior";
  if (streak >= 3) return "🔥 3-Day Streak";
  return null;
}

/* ---------------- TODAY PAGE ---------------- */
const SUBJ_SHORT = {
  "Physics": "Phy", "Physical Chemistry": "P.Chem", "Organic Chemistry": "O.Chem",
  "Inorganic Chemistry": "I.Chem", "Zoology": "Zoo", "Botany": "Bot",
};

function YesterdayReport({ taskStates, studyHours, missedRecords, today, target }) {
  const [open, setOpen] = useState(false);
  const yest = addDays(today, -1);
  const isDone = (t) => computeIsDone(taskStates[t.id]);

  const yestLive = RAW_LIVE.filter(t => t.d === yest);
  const yestBacklog = BACKLOG_TASKS.filter(t => t.scheduledDate === yest);
  const plannedTasks = [...yestLive, ...yestBacklog];
  const completed = plannedTasks.filter(isDone);
  const missed = plannedTasks.filter(t => !isDone(t));

  const h = studyHours[yest] || {};
  const actualHours = Object.values(h).reduce((a, b) => a + (b || 0), 0);
  const achievementPct = target ? Math.min(999, (actualHours / target) * 100) : 0;

  const newMissedYesterday = missedRecords.filter(m => m.missedDate === yest);

  if (plannedTasks.length === 0 && actualHours === 0 && newMissedYesterday.length === 0) return null;

  return (
    <div style={{ background: NAVY_CARD, borderRadius: 14, marginBottom: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <span style={{ fontSize: 18 }}>🌙</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Yesterday Report — {fmtDate(yest)}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{completed.length}/{plannedTasks.length} done · {actualHours}h studied · {achievementPct.toFixed(0)}% of target</div>
        </div>
        {open ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: NAVY_CARD2, borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Planned / Actual hours</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{target}h / {actualHours}h</div>
            </div>
            <div style={{ background: NAVY_CARD2, borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Achievement</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: achievementPct >= 100 ? "#22C55E" : achievementPct >= 60 ? REVISION_GOLD : URGENT_RED }}>{achievementPct.toFixed(0)}%</div>
            </div>
            <div style={{ background: NAVY_CARD2, borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Planned tasks</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{plannedTasks.length}</div>
            </div>
            <div style={{ background: NAVY_CARD2, borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Completed / Missed</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{completed.length} / {missed.length}</div>
            </div>
          </div>

          {missed.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: URGENT_RED, marginBottom: 6 }}>❌ WHAT WAS MISSED?</div>
              {missed.map(t => (
                <div key={t.id} style={{ fontSize: 11.5, color: "var(--text-dim)", padding: "5px 0", borderBottom: "1px solid var(--border2)" }}>
                  <b>{t.id}</b> · {t.s} — {t.c}: {t.t}<br />
                  <span style={{ color: "var(--text-muted)" }}>Original goal date {fmtDate(t.d)} · rolled to Backlog today</span>
                </div>
              ))}
              <div style={{ fontSize: 12, fontWeight: 700, color: REVISION_GOLD, margin: "10px 0 6px" }}>🔁 AUTOMATICALLY ADDED TODAY</div>
              <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>All {missed.length} item(s) above now appear in today's Backlog section — nothing was dropped.</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function OverloadWarning({ taskStates, missedRecords, today, target }) {
  const { overdueBacklog, openMissed } = deriveCarryForward(today, taskStates, missedRecords);
  const liveToday = RAW_LIVE.filter(t => t.d === today);
  const totalTasks = liveToday.length + overdueBacklog.length + openMissed.length;
  const plannedMinutes = totalTasks * LECTURE_MIN;
  const targetMinutes = target * 60;
  const overloadMinutes = plannedMinutes - targetMinutes;
  if (overloadMinutes <= 0) return null;
  const fmtH = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;
  return (
    <div style={{ background: `${URGENT_RED}18`, border: `1px solid ${URGENT_RED}55`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <AlertTriangle size={18} color={URGENT_RED} />
        <span style={{ fontSize: 13, fontWeight: 700, color: URGENT_RED }}>OVERLOAD WARNING</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
        Target: {fmtH(targetMinutes)} · Planned: {fmtH(plannedMinutes)} · <b style={{ color: URGENT_RED }}>Overload: {fmtH(overloadMinutes)}</b>
      </div>
      <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6 }}>
        Priority order if you can't finish everything: Live classes → Carry-forward → Backlog → Missed live → NCERT → Revision → PYQ → DPP → Notes. Nothing gets deleted — lower-priority items just roll to tomorrow.
      </div>
    </div>
  );
}

function StreakStrip({ streak, todayCounted }) {
  const badge = streakBadge(streak);
  if (streak === 0) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${REVISION_GOLD}18`, border: `1px solid ${REVISION_GOLD}55`, borderRadius: 12, padding: "8px 12px", marginBottom: 10 }}>
      <span style={{ fontSize: 16 }}>🔥</span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: REVISION_GOLD }}>{streak}-day streak{!todayCounted ? " (keep it going today!)" : ""}</span>
      {badge && <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: "auto" }}>{badge}</span>}
    </div>
  );
}

function BufferDayBanner() {
  return (
    <div style={{ background: `#3B82F618`, border: "1px solid #3B82F655", borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>🛌</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6" }}>BUFFER & RECOVERY DAY</span>
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>
        Backlog grew 3 days in a row, so no new lectures are being pushed today. Catch up on rest, notes, or light revision instead — the backlog will resume normally tomorrow.
      </div>
    </div>
  );
}

function SpacedRepetitionSection({ dueList, spacedStates, onSpacedToggle }) {
  if (dueList.length === 0) return null;
  return (
    <>
      <SectionHeader icon="🔁" title="SPACED REPETITION DUE" count={dueList.length} color={REVISION_GOLD} />
      {dueList.slice(0, 8).map(({ task, interval, dueDate }) => (
        <div key={`${task.id}-${interval}`} onClick={() => onSpacedToggle(task.id, interval)} style={{
          display: "flex", alignItems: "center", gap: 10, background: NAVY_CARD2, borderRadius: 12, padding: "10px 12px", marginBottom: 8, cursor: "pointer", borderLeft: `3px solid ${REVISION_GOLD}`
        }}>
          <TickBox checked={false} size={19} color={REVISION_GOLD} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--text)" }}>{task.c} — {task.t}</div>
            <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{SUBJECT_STYLE[task.s].emoji} {task.s} · {interval}-day revisit (due {fmtDate(dueDate)})</div>
          </div>
        </div>
      ))}
    </>
  );
}

function TodayPage({ taskStates, onToggle, onHours, onOpenDetail, missedRecords, studyHours, setSubjectHours, today, target, examDate, ncertStates, revisionStates, pyqStates, spacedStates, onSpacedToggle, isBufferDay, assignments, onCompleteAssignment, mistakes, onResolveMistake }) {
  const liveToday = RAW_LIVE.filter(t => t.d === today);
  const { overdueBacklog, openMissed } = deriveCarryForward(today, taskStates, missedRecords);
  const nextQueue = nextBacklogQueue(taskStates, 6, today);
  const catchUpPlan = adaptiveCatchUpPlan(nextQueue.tasks.length > 0 ? effectiveBacklogForSubject(nextQueue.subject, today, t => computeIsDone(taskStates[t.id])).filter(t => !computeIsDone(taskStates[t.id])).length : 0);
  const { streak, todayCounted } = computeStreak(today, taskStates, ncertStates, revisionStates, pyqStates);
  const spacedDue = computeSpacedDue(taskStates, spacedStates, today);
  const assignmentsDue = (assignments || []).filter(a => {
    const st = computeAssignmentStatus(a, today);
    return (st === "Overdue" || a.dueDate === today) && st !== "Completed" && st !== "Skipped";
  });
  const mistakesDue = (mistakes || []).filter(m => m.retestDate && m.retestDate <= today && m.status !== "Resolved");

  const hToday = studyHours[today] || {};
  const totalToday = Object.values(hToday).reduce((a, b) => a + (b || 0), 0);
  const pct = Math.min(100, (totalToday / target) * 100);

  return (
    <div>
      {examDate && (
        <div style={{ background: NAVY_CARD, borderRadius: 12, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>⏳ NEET 2027</span>
          <LiveCountdownCompact examDate={examDate} />
        </div>
      )}
      <StreakStrip streak={streak} todayCounted={todayCounted} />
      {isBufferDay && <BufferDayBanner />}
      <YesterdayReport taskStates={taskStates} studyHours={studyHours} missedRecords={missedRecords} today={today} target={target} />
      <OverloadWarning taskStates={taskStates} missedRecords={missedRecords} today={today} target={target} />
      <div style={{ background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_CARD2})`, borderRadius: 16, padding: 16, marginBottom: 6 }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{dayName(today)}, {fmtDate(today)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
          <ProgressRing pct={pct} color={REVISION_GOLD} size={70} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Study Hours Today</div>

            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{totalToday}h <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>/ {target}h target</span></div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Remaining: {Math.max(0, target - totalToday)}h</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 12 }}>
          {SUBJECT_ORDER.map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--input-bg)", borderRadius: 8, padding: "5px 8px" }}>
              <span style={{ fontSize: 10, color: SUBJECT_STYLE[s].accent, fontWeight: 700, flex: 1 }}>{SUBJ_SHORT[s]}</span>
              <input type="number" step="0.5" min="0" placeholder="0" value={hToday[s] || ""}
                onChange={e => setSubjectHours(today, s, parseFloat(e.target.value) || 0)}
                style={{ width: 44, background: "transparent", border: "none", color: "#fff", fontSize: 12, textAlign: "right" }} />
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>h</span>
            </div>
          ))}
        </div>
      </div>

      <SpacedRepetitionSection dueList={spacedDue} spacedStates={spacedStates} onSpacedToggle={onSpacedToggle} />

      {assignmentsDue.length > 0 && (
        <>
          <SectionHeader icon="📚" title="ASSIGNMENTS DUE" count={assignmentsDue.length} color="#3B82F6" />
          {assignmentsDue.map(a => {
            const style = SUBJECT_STYLE[a.subject] || {};
            const overdue = a.dueDate < today;
            return (
              <div key={a.id} style={{ background: NAVY_CARD2, borderRadius: 12, padding: 12, marginBottom: 8, borderLeft: `4px solid ${overdue ? URGENT_RED : style.accent}` }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <Pill text={`${style.emoji || ""} ${a.subject}`} color={style.accent || "#64748B"} />
                  {overdue && <Pill text="OVERDUE" color={URGENT_RED} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{a.title}</div>
                <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>Due {fmtDate(a.dueDate)}</div>
                <button onClick={() => onCompleteAssignment(a.id)} disabled={!!a.requireProof && !(a.proofImages || []).length} style={{
                  marginTop: 8, background: "#22C55E", color: "#0B1220", border: "none", borderRadius: 8, padding: "7px 14px",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer", opacity: (!!a.requireProof && !(a.proofImages || []).length) ? 0.4 : 1
                }}>✓ Mark Complete</button>
              </div>
            );
          })}
        </>
      )}

      {mistakesDue.length > 0 && (
        <>
          <SectionHeader icon="❌" title="MISTAKE REVISION DUE" count={mistakesDue.length} color={REVISION_GOLD} />
          {mistakesDue.map(m => {
            const style = SUBJECT_STYLE[m.subject] || {};
            return (
              <div key={m.id} style={{ background: NAVY_CARD2, borderRadius: 12, padding: 12, marginBottom: 8, borderLeft: `4px solid ${REVISION_GOLD}` }}>
                <Pill text={`${style.emoji || ""} ${m.subject}`} color={style.accent || "#64748B"} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{m.chapter} — {m.topic}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 3 }}>{m.correctConcept}</div>
                <button onClick={() => onResolveMistake(m.id)} style={{
                  marginTop: 8, background: "#22C55E", color: "#0B1220", border: "none", borderRadius: 8, padding: "7px 14px",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer"
                }}>✓ Revised — Resolve</button>
              </div>
            );
          })}
        </>
      )}

      {(overdueBacklog.length > 0 || openMissed.length > 0) && (
        <>
          <SectionHeader icon="🔴" title="URGENT / CARRY FORWARD" count={overdueBacklog.length + openMissed.length} color={URGENT_RED} />
          {openMissed.slice(0, 6).map(m => (
            <div key={m.taskId} style={{ background: NAVY_CARD2, borderRadius: 14, padding: "12px 14px", marginBottom: 10, borderLeft: `4px solid ${URGENT_RED}` }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                <Pill text="MISSED LIVE" color={URGENT_RED} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>was {fmtDate(m.originalDate)}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>{m.chapter}</div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{m.topic}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{m.teacher}</div>
              <div style={{ marginTop: 8 }}>
                <TaskCompleteInline taskId={m.originalTaskId} taskState={taskStates[m.originalTaskId]} onToggle={(field) => {
                  const orig = PLANNER.find(t => t.id === m.originalTaskId);
                  onToggle(orig, field);
                }} accent={URGENT_RED} />
              </div>
            </div>
          ))}
          {overdueBacklog.slice(0, 6).map(t => (
            <TaskCard key={t.id} task={t} state={taskStates[t.id]} onToggle={onToggle} onHours={onHours} onOpenDetail={onOpenDetail} badge="OVERDUE BACKLOG" badgeColor={URGENT_RED} />
          ))}
        </>
      )}

      <SectionHeader icon="🟢" title="LIVE CLASSES TODAY" count={liveToday.length} color="#22C55E" />
      {liveToday.length === 0 && <EmptyNote text="No live class scheduled today per planner." />}
      {liveToday.map(t => <TaskCard key={t.id} task={t} state={taskStates[t.id]} onToggle={onToggle} onHours={onHours} onOpenDetail={onOpenDetail} />)}

      {isBufferDay ? (
        <>
          <SectionHeader icon="🔥" title="BACKLOG" color="#F97316" />
          <EmptyNote text="🛌 Buffer & Recovery Day — no new backlog lectures assigned today. Existing carry-forward above still applies if you want to chip away at it." />
        </>
      ) : (
        <>
          <SectionHeader icon="🔥" title={`BACKLOG — ${nextQueue.subject || "all clear"}`} count={nextQueue.tasks.length} color="#F97316" />
          {catchUpPlan && (
            <div style={{ background: `${REVISION_GOLD}18`, border: `1px solid ${REVISION_GOLD}55`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: REVISION_GOLD, marginBottom: 4 }}>📈 Adaptive 5-Day Catch-Up Plan</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                Backlog is piling up in {nextQueue.subject} — instead of cramming it all today, try: {catchUpPlan.map((n, i) => `Day ${i + 1}: ${n}`).join(" · ")} lectures.
              </div>
            </div>
          )}
          {nextQueue.tasks.length === 0 && <EmptyNote text="🎉 Backlog fully cleared!" />}
          {nextQueue.tasks.map(t => <TaskCard key={t.id} task={t} state={taskStates[t.id]} onToggle={onToggle} onHours={onHours} onOpenDetail={onOpenDetail} badge="BACKLOG" badgeColor="#F97316" />)}
        </>
      )}
    </div>
  );
}

function TaskCompleteInline({ taskState, onToggle, accent }) {
  const st = taskState || {};
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {["video", "dpp", "notes"].map(k => (
        <button key={k} onClick={() => onToggle(k)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <TickBox checked={!!st[k]} size={19} color={accent} />
          <span style={{ fontSize: 11, color: st[k] ? "var(--text)" : "var(--text-muted)" }}>{k === "video" ? "Video" : k === "dpp" ? "DPP" : "Notes"}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------------- BACKLOG PAGE ---------------- */
function ChapterList({ tasks, taskStates, onToggle, onHours, onOpenDetail, openChapter, setOpenChapter, keyPrefix }) {
  const isDone = (t) => computeIsDone(taskStates[t.id]);
  const chapters = groupByChapter(tasks);
  return (
    <div>
      {Object.entries(chapters).map(([ch, chTasks]) => {
        const chDone = chTasks.filter(isDone).length;
        const chKey = keyPrefix + "::" + ch;
        const chOpen = openChapter === chKey;
        return (
          <div key={ch} style={{ marginBottom: 6 }}>
            <button onClick={() => setOpenChapter(chOpen ? null : chKey)} style={{ width: "100%", background: NAVY_CARD2, border: "none", borderRadius: 10, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 12.5, color: "var(--text-dim)", textAlign: "left" }}>{ch}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, marginLeft: 8 }}>{chDone}/{chTasks.length}</span>
            </button>
            {chOpen && <div style={{ marginTop: 8 }}>{chTasks.map(t => <TaskCard key={t.id} task={t} state={taskStates[t.id]} onToggle={onToggle} onHours={onHours} onOpenDetail={onOpenDetail} />)}</div>}
          </div>
        );
      })}
    </div>
  );
}

function SubjectSection({ subj, taskStates, onToggle, onHours, onOpenDetail, activeSubj, openChapter, setOpenChapter, isOpen, onToggleOpen, today }) {
  const isDone = (t) => computeIsDone(taskStates[t.id]);
  const staticBacklog = BACKLOG_BY_SUBJECT[subj];
  const rolled = rolledOverForSubject(subj, today, isDone);
  const backlogTasks = [...staticBacklog, ...rolled];   // static backlog + auto-rolled missed-live
  const liveTasks = liveRemainingForSubject(subj, today); // live minus anything already rolled to backlog
  const [subTab, setSubTab] = useState("backlog");
  const style = SUBJECT_STYLE[subj];

  const bDone = backlogTasks.filter(isDone).length;
  const bPct = backlogTasks.length ? (bDone / backlogTasks.length) * 100 : 100;
  const lDone = liveTasks.filter(isDone).length;
  const lPct = liveTasks.length ? (lDone / liveTasks.length) * 100 : 100;

  const locked = activeSubj && subj !== activeSubj && SUBJECT_ORDER.indexOf(subj) > SUBJECT_ORDER.indexOf(activeSubj) && backlogTasks.length > 0;
  const noBacklog = backlogTasks.length === 0;
  const firstLiveDate = liveTasks.length ? liveTasks[0].d : null;

  return (
    <div style={{ background: NAVY_CARD, borderRadius: 14, marginBottom: 12, overflow: "hidden", border: `1px solid ${style.accent}33` }}>
      <button onClick={onToggleOpen} style={{ width: "100%", background: "none", border: "none", padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <span style={{ fontSize: 22 }}>{style.emoji}</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 15 }}>
            {subj}{" "}
            {subj === activeSubj && <span style={{ color: "#F97316", fontSize: 11 }}>● ACTIVE</span>}
            {locked && <span style={{ color: "var(--text-muted)", fontSize: 11 }}>🔒 locked</span>}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {noBacklog ? `No backlog · live starts ${fmtDate(firstLiveDate)}` : `Backlog ${bDone}/${backlogTasks.length}`}
            {rolled.length > 0 && <span style={{ color: URGENT_RED }}> (+{rolled.length} rolled from live)</span>}
            {liveTasks.length > 0 && ` · Live ${lDone}/${liveTasks.length} upcoming`}
          </div>
        </div>
        {isOpen ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
      </button>

      {isOpen && (
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <button onClick={() => setSubTab("backlog")} disabled={noBacklog} style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: noBacklog ? "default" : "pointer",
              background: subTab === "backlog" ? style.accent : "var(--input-bg)", color: subTab === "backlog" ? "var(--input-bg)" : (noBacklog ? "var(--border)" : "var(--text-dim)"),
              fontSize: 12, fontWeight: 700
            }}>🔥 Backlog ({backlogTasks.length})</button>
            <button onClick={() => setSubTab("live")} style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
              background: subTab === "live" ? style.accent : "var(--input-bg)", color: subTab === "live" ? "var(--input-bg)" : "var(--text-dim)",
              fontSize: 12, fontWeight: 700
            }}>🟢 Live ({liveTasks.length})</button>
          </div>

          {subTab === "backlog" && (
            noBacklog
              ? <EmptyNote text={`No backlog for ${subj} — this subject's classes begin live from ${fmtDate(firstLiveDate)}.`} />
              : <>
                  <div style={{ marginBottom: 8 }}><ProgressBar pct={bPct} color={style.accent} /></div>
                  <ChapterList tasks={backlogTasks} taskStates={taskStates} onToggle={onToggle} onHours={onHours} onOpenDetail={onOpenDetail} openChapter={openChapter} setOpenChapter={setOpenChapter} keyPrefix={subj + "-BL"} />
                </>
          )}
          {subTab === "live" && (
            liveTasks.length === 0
              ? <EmptyNote text="No upcoming live classes — everything's either done or has rolled into Backlog." />
              : <>
                  <div style={{ marginBottom: 8 }}><ProgressBar pct={lPct} color={style.accent} /></div>
                  <ChapterList tasks={liveTasks} taskStates={taskStates} onToggle={onToggle} onHours={onHours} onOpenDetail={onOpenDetail} openChapter={openChapter} setOpenChapter={setOpenChapter} keyPrefix={subj + "-LV"} />
                </>
          )}
        </div>
      )}
    </div>
  );
}

function BacklogPage({ taskStates, onToggle, onHours, onOpenDetail, today }) {
  const [openSubj, setOpenSubj] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);
  const isDone = (t) => computeIsDone(taskStates[t.id]);

  let activeSubj = null;
  for (const s of SUBJECT_ORDER) {
    const pending = effectiveBacklogForSubject(s, today, isDone).some(t => !isDone(t));
    if (pending) { activeSubj = s; break; }
  }
  const currentOpen = openSubj === null ? activeSubj : openSubj;

  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>
        Schedule: Mon-Sat 2 backlog lectures/day, Sunday 3/day, starting {fmtDate(BACKLOG_SCHED_START)}. Sequence locked: Physics → Physical Chem → Organic Chem → Inorganic Chem → Zoology → Botany.
      </div>
      <div style={{ fontSize: 12, color: REVISION_GOLD, marginBottom: 6 }}>
        Projected full backlog clearance by: {fmtDate(ALL_BACKLOG_END_DATE)}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 14 }}>
        Any live class not finished by its date automatically rolls into that subject's Backlog the next day.
      </div>
      {SUBJECT_ORDER.map(subj => (
        <SubjectSection
          key={subj}
          subj={subj}
          taskStates={taskStates}
          onToggle={onToggle}
          onHours={onHours}
          onOpenDetail={onOpenDetail}
          activeSubj={activeSubj}
          openChapter={openChapter}
          setOpenChapter={setOpenChapter}
          isOpen={currentOpen === subj}
          onToggleOpen={() => setOpenSubj(currentOpen === subj ? "" : subj)}
          today={today}
        />
      ))}
    </div>
  );
}


/* ---------------- HISTORY PAGE ---------------- */
function HistoryPage({ history }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>Permanent, append-only activity log.</div>
      {history.length === 0 && <EmptyNote text="No activity yet." />}
      {[...history].reverse().slice(0, 200).map((h, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "8px 4px", borderBottom: "1px solid var(--border2)" }}>
          <Clock size={14} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: "var(--text)" }}>{h.text}</div>
            <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{new Date(h.ts).toLocaleString("en-IN")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompletedHistoryPage({ completedHistory }) {
  const sorted = [...completedHistory].sort((a, b) => (b.completionTime || "").localeCompare(a.completionTime || ""));
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>
        Permanent record of every completed lecture — one entry per task, never duplicated even if you re-open and re-tick it.
      </div>
      <div style={{ fontSize: 11.5, color: REVISION_GOLD, marginBottom: 12 }}>{completedHistory.length} lectures completed all-time</div>
      {sorted.length === 0 && <EmptyNote text="Nothing completed yet." />}
      {sorted.map(r => {
        const style = SUBJECT_STYLE[r.subject] || {};
        return (
          <div key={r.taskId} style={{ background: NAVY_CARD, borderRadius: 10, padding: 10, marginBottom: 6, borderLeft: `3px solid ${style.accent || "#64748B"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <Pill text={`${style.emoji || ""} ${r.subject}`} color={style.accent || "#64748B"} />
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{r.completionTime ? new Date(r.completionTime).toLocaleString("en-IN") : ""}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text)", fontWeight: 500 }}>{r.chapter} — {r.title}</div>
            <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>
              {r.durationMinutes ? `${(r.durationMinutes / 60).toFixed(1)}h logged` : "no time logged"}{r.proofRef ? ` · ${r.proofRef}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- DASHBOARD (Home) PAGE ---------------- */
/* ============================================================
   MODULE 2 — NCERT 8-ROUND TRACKER (Zoology + Botany only)
   Each chapter gets 8 independent line-by-line reading rounds.
   Round due-dates are staggered evenly from today to the R8
   target (1st week of March 2027) — every chapter is read once
   per round before the next round begins.
   ============================================================ */
const NCERT_SUBJECTS = ["Zoology", "Botany"];
const NCERT_ROUNDS = 8;
const NCERT_START = "2026-08-20";

function ncertChapters(subj) {
  const seen = [];
  PLANNER.forEach(t => { if (t.s === subj && !seen.includes(t.c)) seen.push(t.c); });
  return seen;
}

function buildNcertSchedule() {
  const totalDays = daysBetween(NCERT_START, NCERT_R8_TARGET);
  const band = Math.floor(totalDays / NCERT_ROUNDS);
  const rounds = [];
  for (let r = 1; r <= NCERT_ROUNDS; r++) {
    const planned = addDays(NCERT_START, band * (r - 1));
    const due = r === NCERT_ROUNDS ? NCERT_R8_TARGET : addDays(NCERT_START, band * r);
    rounds.push({ round: r, plannedDate: planned, dueDate: due });
  }
  return rounds;
}
const NCERT_ROUND_SCHEDULE = buildNcertSchedule();

const NCERT_TASKS = []; // {taskId, subject, chapter, round, plannedDate, dueDate}
NCERT_SUBJECTS.forEach(subj => {
  const chapters = ncertChapters(subj);
  chapters.forEach((ch, ci) => {
    NCERT_ROUND_SCHEDULE.forEach(({ round, plannedDate, dueDate }) => {
      const prefix = subj === "Zoology" ? "ZOO" : "BOT";
      NCERT_TASKS.push({
        taskId: `NCERT-${prefix}-R${round}-${String(ci + 1).padStart(2, "0")}`,
        subject: subj, chapter: ch, round, plannedDate, dueDate,
      });
    });
  });
});

function NcertRoundRow({ subj, round, dueDate, plannedDate, ncertStates, onToggle, today }) {
  const chapters = ncertChapters(subj);
  const prefix = subj === "Zoology" ? "ZOO" : "BOT";
  const tasksInRound = chapters.map((ch, ci) => ({
    taskId: `NCERT-${prefix}-R${round}-${String(ci + 1).padStart(2, "0")}`, chapter: ch,
  }));
  const done = tasksInRound.filter(t => ncertStates[t.taskId]?.done).length;
  const pct = (done / tasksInRound.length) * 100;
  const overdue = dueDate < today && pct < 100;
  const [open, setOpen] = useState(false);
  const style = SUBJECT_STYLE[subj];

  return (
    <div style={{ background: NAVY_CARD, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: `${style.accent}22`, color: style.accent,
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0
        }}>R{round}</div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
            Round {round} {overdue && <span style={{ color: URGENT_RED, fontSize: 11 }}>● OVERDUE</span>}
            {pct === 100 && <span style={{ color: "#22C55E", fontSize: 11 }}>✓ Complete</span>}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Due {fmtDate(dueDate)} · {done}/{tasksInRound.length} chapters</div>
          <div style={{ marginTop: 5 }}><ProgressBar pct={pct} color={style.accent} height={6} /></div>
        </div>
        {open ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px" }}>
          {tasksInRound.map(t => {
            const st = ncertStates[t.taskId] || {};
            return (
              <div key={t.taskId} onClick={() => onToggle(t.taskId, subj, t.chapter, round)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 4px", cursor: "pointer",
                borderBottom: "1px solid var(--border2)"
              }}>
                <TickBox checked={!!st.done} size={20} color={style.accent} />
                <span style={{ fontSize: 12.5, color: st.done ? "var(--text-muted)" : "var(--text)", textDecoration: st.done ? "line-through" : "none" }}>{t.chapter}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PHASE 6 — Per-chapter view for NCERT/Revision: shows every
   round's status in one row per chapter (matrix), plus last
   completed / next due, and lets you reschedule an overdue
   round to a new date instead of leaving it silently stuck.
   ============================================================ */
function ChapterMatrixView({ subj, chapters, rounds, states, taskPrefixFn, onToggle, today, accent, overrides, onReschedule }) {
  return (
    <div>
      {chapters.map((ch, ci) => {
        const cellData = rounds.map(({ round, dueDate }) => {
          const taskId = taskPrefixFn(ci, round);
          const st = states[taskId];
          const effectiveDue = (overrides && overrides[taskId]) || dueDate;
          const overdue = effectiveDue < today && !st?.done;
          return { round, taskId, done: !!st?.done, dueDate: effectiveDue, overdue, completedAt: st?.completedAt };
        });
        const lastCompleted = [...cellData].reverse().find(c => c.done);
        const nextDue = cellData.find(c => !c.done);
        return (
          <div key={ch} style={{ background: NAVY_CARD, borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{ch}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
              {cellData.map(c => (
                <button key={c.round} onClick={() => onToggle(c.taskId, subj, ch, c.round)} title={`R${c.round} · due ${fmtDate(c.dueDate)}`} style={{
                  width: 26, height: 26, borderRadius: 6, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700,
                  background: c.done ? accent : c.overdue ? `${URGENT_RED}33` : "var(--input-bg)",
                  color: c.done ? "#0B1220" : c.overdue ? URGENT_RED : "var(--text-muted)"
                }}>{c.done ? "✓" : c.overdue ? "!" : c.round}</button>
              ))}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
              {lastCompleted ? `Last: R${lastCompleted.round} on ${lastCompleted.completedAt ? fmtDate(lastCompleted.completedAt.slice(0, 10)) : ""}` : "Not started"}
              {nextDue && ` · Next: R${nextDue.round} due ${fmtDate(nextDue.dueDate)}`}
            </div>
            {nextDue?.overdue && (
              <button onClick={() => onReschedule(nextDue.taskId, addDays(today, 3))} style={{
                marginTop: 6, background: "none", border: `1px solid ${URGENT_RED}55`, color: URGENT_RED, borderRadius: 6,
                padding: "4px 10px", fontSize: 10.5, cursor: "pointer"
              }}>Reschedule R{nextDue.round} to {fmtDate(addDays(today, 3))}</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NcertPage({ ncertStates, onToggle, today, dueDateOverrides, onReschedule }) {
  const [subj, setSubj] = useState("Zoology");
  const [view, setView] = useState("rounds"); // rounds | chapters
  const style = SUBJECT_STYLE[subj];

  const overallDone = NCERT_TASKS.filter(t => ncertStates[t.taskId]?.done && t.subject === subj).length;
  const overallTotal = NCERT_TASKS.filter(t => t.subject === subj).length;
  const overallPct = (overallDone / overallTotal) * 100;
  const chapters = ncertChapters(subj);
  const prefix = subj === "Zoology" ? "ZOO" : "BOT";

  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 4 }}>
        Line-by-line NCERT reading — 8 independent rounds per chapter. R8 target: {fmtDate(NCERT_R8_TARGET)}.
      </div>
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        {NCERT_SUBJECTS.map(s => (
          <button key={s} onClick={() => setSubj(s)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: subj === s ? SUBJECT_STYLE[s].accent : NAVY_CARD,
            color: subj === s ? "var(--input-bg)" : "var(--text-dim)", fontSize: 13, fontWeight: 700
          }}>{SUBJECT_STYLE[s].emoji} {s}</button>
        ))}
      </div>

      <div style={{ background: NAVY_CARD2, borderRadius: 14, padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
        <ProgressRing pct={overallPct} size={60} color={style.accent} />
        <div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{subj} — overall NCERT progress</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{overallDone} / {overallTotal} chapter-rounds</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setView("rounds")} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", background: view === "rounds" ? style.accent : NAVY_CARD, color: view === "rounds" ? "var(--input-bg)" : "var(--text-dim)", fontSize: 11.5, fontWeight: 700 }}>By Round</button>
        <button onClick={() => setView("chapters")} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", background: view === "chapters" ? style.accent : NAVY_CARD, color: view === "chapters" ? "var(--input-bg)" : "var(--text-dim)", fontSize: 11.5, fontWeight: 700 }}>By Chapter</button>
      </div>

      {view === "rounds"
        ? NCERT_ROUND_SCHEDULE.map(({ round, plannedDate, dueDate }) => (
            <NcertRoundRow key={round} subj={subj} round={round} dueDate={dueDate} plannedDate={plannedDate} ncertStates={ncertStates} onToggle={onToggle} today={today} />
          ))
        : <ChapterMatrixView
            subj={subj}
            chapters={chapters}
            rounds={NCERT_ROUND_SCHEDULE}
            states={ncertStates}
            taskPrefixFn={(ci, round) => `NCERT-${prefix}-R${round}-${String(ci + 1).padStart(2, "0")}`}
            onToggle={onToggle}
            today={today}
            accent={style.accent}
            overrides={dueDateOverrides}
            onReschedule={onReschedule}
          />
      }
    </div>
  );
}

/* ============================================================
   MODULE 3 — REVISION 5-ROUND TRACKER (all 6 subjects)
   ============================================================ */
const REVISION_ROUNDS = 5;
const REVISION_START = "2026-11-01";  // once core content is underway
const REVISION_END = addDays(EXAM_DATE_DEFAULT, -14); // finish with a 2-week buffer before exam

function subjectChapters(subj) {
  const seen = [];
  PLANNER.forEach(t => { if (t.s === subj && !seen.includes(t.c)) seen.push(t.c); });
  return seen;
}
const SUBJ_PREFIX = { "Physics": "PHY", "Physical Chemistry": "PCH", "Organic Chemistry": "OCH", "Inorganic Chemistry": "ICH", "Zoology": "ZOO", "Botany": "BOT" };

function buildRoundSchedule(start, end, count) {
  const totalDays = daysBetween(start, end);
  const band = Math.floor(totalDays / count);
  const rounds = [];
  for (let r = 1; r <= count; r++) {
    const planned = addDays(start, band * (r - 1));
    const due = r === count ? end : addDays(start, band * r);
    rounds.push({ round: r, plannedDate: planned, dueDate: due });
  }
  return rounds;
}
const REVISION_ROUND_SCHEDULE = buildRoundSchedule(REVISION_START, REVISION_END, REVISION_ROUNDS);

function RoundRow({ subj, round, dueDate, chapters, states, storeKey, onToggle, today, accent, taskPrefix }) {
  const [open, setOpen] = useState(false);
  const tasksInRound = chapters.map((ch, ci) => ({ taskId: `${taskPrefix}-R${round}-${String(ci + 1).padStart(2, "0")}`, chapter: ch }));
  const done = tasksInRound.filter(t => states[t.taskId]?.done).length;
  const pct = (done / tasksInRound.length) * 100;
  const overdue = dueDate < today && pct < 100;

  return (
    <div style={{ background: NAVY_CARD, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}22`, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>R{round}</div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
            Round {round} {overdue && <span style={{ color: URGENT_RED, fontSize: 11 }}>● OVERDUE</span>}
            {pct === 100 && <span style={{ color: "#22C55E", fontSize: 11 }}>✓ Complete</span>}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Due {fmtDate(dueDate)} · {done}/{tasksInRound.length} chapters</div>
          <div style={{ marginTop: 5 }}><ProgressBar pct={pct} color={accent} height={6} /></div>
        </div>
        {open ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px" }}>
          {tasksInRound.map(t => {
            const st = states[t.taskId] || {};
            return (
              <div key={t.taskId} onClick={() => onToggle(t.taskId, subj, t.chapter, round)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 4px", cursor: "pointer", borderBottom: "1px solid var(--border2)" }}>
                <TickBox checked={!!st.done} size={20} color={accent} />
                <span style={{ fontSize: 12.5, color: st.done ? "var(--text-muted)" : "var(--text)", textDecoration: st.done ? "line-through" : "none" }}>{t.chapter}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RevisionPage({ revisionStates, onToggle, today, dueDateOverrides, onReschedule }) {
  const [subj, setSubj] = useState("Physics");
  const [view, setView] = useState("rounds");
  const style = SUBJECT_STYLE[subj];
  const chapters = subjectChapters(subj);
  const prefix = "REV-" + SUBJ_PREFIX[subj];
  const totalTasks = REVISION_ROUNDS * chapters.length;
  const doneTasks = REVISION_ROUND_SCHEDULE.reduce((sum, { round }) => {
    return sum + chapters.filter((ch, ci) => revisionStates[`${prefix}-R${round}-${String(ci + 1).padStart(2, "0")}`]?.done).length;
  }, 0);
  const pct = (doneTasks / totalTasks) * 100;

  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 10 }}>
        5 independent revision rounds per subject. Window: {fmtDate(REVISION_START)} → {fmtDate(REVISION_END)}.
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {SUBJECT_ORDER.map(s => (
          <button key={s} onClick={() => setSubj(s)} style={{
            padding: "7px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: subj === s ? SUBJECT_STYLE[s].accent : NAVY_CARD,
            color: subj === s ? "var(--input-bg)" : "var(--text-dim)", fontSize: 11, fontWeight: 700
          }}>{SUBJECT_STYLE[s].emoji} {SUBJ_SHORT[s]}</button>
        ))}
      </div>
      <div style={{ background: NAVY_CARD2, borderRadius: 14, padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
        <ProgressRing pct={pct} size={60} color={style.accent} />
        <div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{subj} — overall revision progress</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{doneTasks} / {totalTasks} chapter-rounds</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setView("rounds")} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", background: view === "rounds" ? style.accent : NAVY_CARD, color: view === "rounds" ? "var(--input-bg)" : "var(--text-dim)", fontSize: 11.5, fontWeight: 700 }}>By Round</button>
        <button onClick={() => setView("chapters")} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", background: view === "chapters" ? style.accent : NAVY_CARD, color: view === "chapters" ? "var(--input-bg)" : "var(--text-dim)", fontSize: 11.5, fontWeight: 700 }}>By Chapter</button>
      </div>

      {view === "rounds"
        ? REVISION_ROUND_SCHEDULE.map(({ round, dueDate }) => (
            <RoundRow key={round} subj={subj} round={round} dueDate={dueDate} chapters={chapters} states={revisionStates} onToggle={onToggle} today={today} accent={style.accent} taskPrefix={prefix} />
          ))
        : <ChapterMatrixView
            subj={subj}
            chapters={chapters}
            rounds={REVISION_ROUND_SCHEDULE}
            states={revisionStates}
            taskPrefixFn={(ci, round) => `${prefix}-R${round}-${String(ci + 1).padStart(2, "0")}`}
            onToggle={onToggle}
            today={today}
            accent={style.accent}
            overrides={dueDateOverrides}
            onReschedule={onReschedule}
          />
      }
    </div>
  );
}

/* ============================================================
   MODULE 4 — PYQ TRACKER (1990-2026, 37 years x 6 subjects)
   Chapter/question-level PYQ data is not fabricated — user logs
   question count, hours and notes per year x subject as they
   solve papers.
   ============================================================ */
const PYQ_YEARS = Array.from({ length: 37 }, (_, i) => 1990 + i); // 1990..2026

function PyqYearRow({ year, pyqStates, onUpdate }) {
  const [open, setOpen] = useState(false);
  const doneCount = SUBJECT_ORDER.filter(s => pyqStates[`PYQ-${year}-${SUBJ_PREFIX[s]}`]?.status === "Completed").length;
  return (
    <div style={{ background: NAVY_CARD, borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: 12, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", width: 46, textAlign: "left" }}>{year}</span>
        <div style={{ flex: 1 }}><ProgressBar pct={(doneCount / 6) * 100} color={REVISION_GOLD} height={6} /></div>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{doneCount}/6</span>
        {open ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: "0 12px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {SUBJECT_ORDER.map(s => {
            const taskId = `PYQ-${year}-${SUBJ_PREFIX[s]}`;
            const st = pyqStates[taskId] || {};
            const style = SUBJECT_STYLE[s];
            const isDone = st.status === "Completed";
            return (
              <div key={s} style={{ background: NAVY_CARD2, borderRadius: 10, padding: 8, borderLeft: `3px solid ${style.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 10.5, color: style.accent, fontWeight: 700 }}>{style.emoji} {SUBJ_SHORT[s]}</span>
                  <TickBox checked={isDone} size={17} color={style.accent} onClick={() => {}} />
                </div>
                <input type="number" placeholder="Qs" value={st.questionCount || ""}
                  onChange={e => onUpdate(taskId, year, s, { questionCount: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 6px", color: "#fff", fontSize: 11, marginBottom: 4 }} />
                <select value={st.tier || "Unrated"} onChange={e => onUpdate(taskId, year, s, { tier: e.target.value })}
                  style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 4px", color: "var(--text-dim)", fontSize: 10, marginBottom: 4 }}>
                  <option value="Unrated">Tier: Unrated</option>
                  <option value="Easy">🟢 Easy</option>
                  <option value="Moderate">🟡 Moderate</option>
                  <option value="High-Yield Repeater">🔴 High-Yield Repeater</option>
                </select>
                <button onClick={() => onUpdate(taskId, year, s, { status: isDone ? "Not Started" : "Completed" })}
                  style={{ width: "100%", background: isDone ? style.accent : "var(--input-bg)", color: isDone ? "var(--input-bg)" : "var(--text-dim)", border: "none", borderRadius: 6, padding: "4px 0", fontSize: 10.5, fontWeight: 700, cursor: "pointer" }}>
                  {isDone ? "✓ Done" : "Mark Done"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PyqPage({ pyqStates, onUpdate }) {
  const totalDone = PYQ_YEARS.reduce((sum, y) => sum + SUBJECT_ORDER.filter(s => pyqStates[`PYQ-${y}-${SUBJ_PREFIX[s]}`]?.status === "Completed").length, 0);
  const totalTasks = PYQ_YEARS.length * SUBJECT_ORDER.length;
  const tierCounts = { "Easy": 0, "Moderate": 0, "High-Yield Repeater": 0 };
  Object.values(pyqStates).forEach(st => { if (st.tier && tierCounts[st.tier] !== undefined) tierCounts[st.tier]++; });
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 10 }}>37 years of PYQs (1990–2026) × 6 subjects. Log question count, tag difficulty tier, and mark done as you solve each year's paper.</div>
      <div style={{ background: NAVY_CARD2, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
        <ProgressRing pct={(totalDone / totalTasks) * 100} size={60} color={REVISION_GOLD} />
        <div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Overall PYQ coverage</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{totalDone} / {totalTasks} year-subjects</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div style={{ background: NAVY_CARD, borderRadius: 10, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#22C55E" }}>{tierCounts["Easy"]}</div>
          <div style={{ fontSize: 9.5, color: "var(--text-muted)" }}>🟢 Easy</div>
        </div>
        <div style={{ background: NAVY_CARD, borderRadius: 10, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: REVISION_GOLD }}>{tierCounts["Moderate"]}</div>
          <div style={{ fontSize: 9.5, color: "var(--text-muted)" }}>🟡 Moderate</div>
        </div>
        <div style={{ background: NAVY_CARD, borderRadius: 10, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: URGENT_RED }}>{tierCounts["High-Yield Repeater"]}</div>
          <div style={{ fontSize: 9.5, color: "var(--text-muted)" }}>🔴 High-Yield</div>
        </div>
      </div>
      {[...PYQ_YEARS].reverse().map(y => <PyqYearRow key={y} year={y} pyqStates={pyqStates} onUpdate={onUpdate} />)}
    </div>
  );
}

/* ============================================================
   MODULE 5a — MISTAKE BOOK
   ============================================================ */
function MistakeForm({ onSave, onCancel }) {
  const [f, setF] = useState({
    date: todayISO(), subject: "Physics", chapter: "", topic: "", question: "",
    questionSource: "", wrongAnswer: "", correctAnswer: "", errorType: "Conceptual", difficulty: "Moderate",
    whatWentWrong: "", correctConcept: "", correction: "", tags: "", retestDate: "", images: [],
  });
  const [imgWarning, setImgWarning] = useState("");
  const upd = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 600 * 1024) {
      setImgWarning("Image is large (>600KB) — attaching many of these may hit your storage limit. Consider a smaller screenshot.");
    } else {
      setImgWarning("");
    }
    const reader = new FileReader();
    reader.onload = () => setF(prev => ({ ...prev, images: [...prev.images, reader.result] }));
    reader.readAsDataURL(file);
  };
  const removeImage = (idx) => setF(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  return (
    <div style={{ background: NAVY_CARD2, borderRadius: 14, padding: 14, marginBottom: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <input type="date" value={f.date} onChange={e => upd("date", e.target.value)} style={inputStyle} />
        <select value={f.subject} onChange={e => upd("subject", e.target.value)} style={inputStyle}>
          {SUBJECT_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <input placeholder="Chapter" value={f.chapter} onChange={e => upd("chapter", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <input placeholder="Topic" value={f.topic} onChange={e => upd("topic", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <textarea placeholder="Question (text, optional if photo attached)" value={f.question} onChange={e => upd("question", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8, minHeight: 44 }} />
      <input placeholder="Question source (DPP / Test / PYQ)" value={f.questionSource} onChange={e => upd("questionSource", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <input placeholder="Your (wrong) answer" value={f.wrongAnswer} onChange={e => upd("wrongAnswer", e.target.value)} style={inputStyle} />
        <input placeholder="Correct answer" value={f.correctAnswer} onChange={e => upd("correctAnswer", e.target.value)} style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <select value={f.errorType} onChange={e => upd("errorType", e.target.value)} style={inputStyle}>
          {["Conceptual", "Calculation", "Silly Mistake", "Formula", "Memory", "Reading Error", "Time Management"].map(x => <option key={x}>{x}</option>)}
        </select>
        <select value={f.difficulty} onChange={e => upd("difficulty", e.target.value)} style={inputStyle}>
          <option>Easy</option><option>Moderate</option><option>Hard</option>
        </select>
      </div>
      <textarea placeholder="What went wrong" value={f.whatWentWrong} onChange={e => upd("whatWentWrong", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8, minHeight: 50 }} />
      <textarea placeholder="Explanation / correct concept" value={f.correctConcept} onChange={e => upd("correctConcept", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8, minHeight: 50 }} />
      <input placeholder="Correct method / how to avoid next time" value={f.correction} onChange={e => upd("correction", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <input placeholder="Tags (comma separated, e.g. formula, silly, unit-error)" value={f.tags} onChange={e => upd("tags", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <input type="date" placeholder="Re-test date" value={f.retestDate} onChange={e => upd("retestDate", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>📷 Attach photo(s) of the question</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
          {f.images.map((img, idx) => (
            <div key={idx} style={{ position: "relative", width: 64, height: 64 }}>
              <img src={img} alt={`q${idx}`} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
              <button onClick={() => removeImage(idx)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: 9, background: URGENT_RED, color: "#fff", border: "none", fontSize: 10, cursor: "pointer" }}>✕</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleFile} style={{ fontSize: 11, color: "var(--text-dim)" }} />
        {imgWarning && <div style={{ fontSize: 10.5, color: REVISION_GOLD, marginTop: 4 }}>{imgWarning}</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onSave(f)} style={{ flex: 1, background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save</button>
        <button onClick={onCancel} style={{ flex: 1, background: "var(--border2)", color: "var(--text-dim)", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}
const inputStyle = { background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "#fff", fontSize: 12.5 };

function MistakeBookPage({ mistakes, onAdd, onResolve, onConvertToRevision, today }) {
  const [showForm, setShowForm] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const unresolved = mistakes.filter(m => m.status !== "Resolved");
  const resolved = mistakes.filter(m => m.status === "Resolved");
  const allTags = [...new Set(mistakes.flatMap(m => (m.tags || "").split(",").map(t => t.trim()).filter(Boolean)))];
  const visible = tagFilter ? mistakes.filter(m => (m.tags || "").toLowerCase().includes(tagFilter.toLowerCase())) : mistakes;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{unresolved.length} open · {resolved.length} resolved</div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: URGENT_RED, color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <Plus size={14} /> Add Mistake
        </button>
      </div>
      {showForm && <MistakeForm onSave={(f) => { onAdd(f); setShowForm(false); }} onCancel={() => setShowForm(false)} />}

      {allTags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          <button onClick={() => setTagFilter("")} style={{ padding: "4px 9px", borderRadius: 6, border: "none", cursor: "pointer", background: !tagFilter ? "#3B82F6" : NAVY_CARD, color: !tagFilter ? "#fff" : "var(--text-dim)", fontSize: 10.5 }}>All</button>
          {allTags.map(t => (
            <button key={t} onClick={() => setTagFilter(t)} style={{ padding: "4px 9px", borderRadius: 6, border: "none", cursor: "pointer", background: tagFilter === t ? "#3B82F6" : NAVY_CARD, color: tagFilter === t ? "#fff" : "var(--text-dim)", fontSize: 10.5 }}>#{t}</button>
          ))}
        </div>
      )}

      {visible.length === 0 && <EmptyNote text="No mistakes logged yet — add one after every test/DPP review." />}
      {[...visible].reverse().map(m => {
        const style = SUBJECT_STYLE[m.subject] || { accent: "var(--text-muted)" };
        const isResolved = m.status === "Resolved";
        const dueForRetest = m.retestDate && m.retestDate <= today && !isResolved;
        return (
          <div key={m.id} style={{ background: NAVY_CARD2, borderRadius: 12, padding: 12, marginBottom: 8, borderLeft: `4px solid ${isResolved ? "#22C55E" : dueForRetest ? REVISION_GOLD : URGENT_RED}`, opacity: isResolved ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
              <Pill text={`${style.emoji || ""} ${m.subject}`} color={style.accent} />
              <Pill text={m.difficulty || "Moderate"} color={m.difficulty === "Hard" ? URGENT_RED : m.difficulty === "Easy" ? "#22C55E" : REVISION_GOLD} />
              <span style={{ fontSize: 10.5, color: "var(--text-muted)", marginLeft: "auto" }}>{fmtDate(m.date)}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{m.chapter} — {m.topic}</div>
            {m.question && <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 3, fontStyle: "italic" }}>{m.question}</div>}
            {(m.wrongAnswer || m.correctAnswer) && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                {m.wrongAnswer && <span>❌ {m.wrongAnswer}</span>}{m.wrongAnswer && m.correctAnswer && " · "}{m.correctAnswer && <span style={{ color: "#22C55E" }}>✓ {m.correctAnswer}</span>}
              </div>
            )}
            <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 3 }}><b>{m.errorType}:</b> {m.whatWentWrong}</div>
            <div style={{ fontSize: 11.5, color: "#22C55E", marginTop: 2 }}>✓ {m.correctConcept}</div>
            {m.tags && <div style={{ marginTop: 4 }}>{m.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => <span key={t} style={{ fontSize: 9.5, color: "#3B82F6", marginRight: 6 }}>#{t}</span>)}</div>}
            {(m.images || (m.imageData ? [m.imageData] : [])).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {(m.images || [m.imageData]).map((img, idx) => (
                  <img key={idx} src={img} alt="mistake" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
                ))}
              </div>
            )}
            {m.retestDate && <div style={{ fontSize: 10.5, color: dueForRetest ? REVISION_GOLD : "var(--text-muted)", marginTop: 6 }}>{dueForRetest ? "⏰ Due for retest" : "Retest"}: {fmtDate(m.retestDate)}</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => onResolve(m.id)} style={{ background: "none", border: `1px solid ${isResolved ? "#22C55E" : "var(--border)"}`, color: isResolved ? "#22C55E" : "var(--text-dim)", borderRadius: 6, padding: "4px 10px", fontSize: 10.5, cursor: "pointer" }}>
                {isResolved ? "✓ Resolved" : "Mark Resolved"}
              </button>
              {!isResolved && (
                <button onClick={() => onConvertToRevision(m.id)} style={{ background: "none", border: `1px solid ${REVISION_GOLD}55`, color: REVISION_GOLD, borderRadius: 6, padding: "4px 10px", fontSize: 10.5, cursor: "pointer" }}>
                  🔁 Revise in 3 days
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MODULE 5b — TEST ANALYSIS
   ============================================================ */
function TestForm({ onSave, onCancel }) {
  const [f, setF] = useState({ testName: "", date: todayISO(), subject: "Physics", totalMarks: 720, score: "", correct: "", wrong: "", unattempted: "", weakAreas: "", notes: "" });
  const upd = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  return (
    <div style={{ background: NAVY_CARD2, borderRadius: 14, padding: 14, marginBottom: 14 }}>
      <input placeholder="Test name" value={f.testName} onChange={e => upd("testName", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <input type="date" value={f.date} onChange={e => upd("date", e.target.value)} style={inputStyle} />
        <select value={f.subject} onChange={e => upd("subject", e.target.value)} style={inputStyle}>
          <option value="Full Syllabus">Full Syllabus</option>
          {SUBJECT_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <input type="number" placeholder="Total marks" value={f.totalMarks} onChange={e => upd("totalMarks", parseInt(e.target.value) || 0)} style={inputStyle} />
        <input type="number" placeholder="Your score" value={f.score} onChange={e => upd("score", parseInt(e.target.value) || 0)} style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
        <input type="number" placeholder="Correct" value={f.correct} onChange={e => upd("correct", parseInt(e.target.value) || 0)} style={inputStyle} />
        <input type="number" placeholder="Wrong" value={f.wrong} onChange={e => upd("wrong", parseInt(e.target.value) || 0)} style={inputStyle} />
        <input type="number" placeholder="Unattempted" value={f.unattempted} onChange={e => upd("unattempted", parseInt(e.target.value) || 0)} style={inputStyle} />
      </div>
      <input placeholder="Weak areas" value={f.weakAreas} onChange={e => upd("weakAreas", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <textarea placeholder="Notes" value={f.notes} onChange={e => upd("notes", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 10, minHeight: 50 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onSave(f)} style={{ flex: 1, background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save</button>
        <button onClick={onCancel} style={{ flex: 1, background: "var(--border2)", color: "var(--text-dim)", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

function TestAnalysisPage({ tests, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const avgPct = tests.length ? (tests.reduce((s, t) => s + (t.score / t.totalMarks) * 100, 0) / tests.length) : 0;
  const maxH = Math.max(100, ...tests.map(t => (t.score / t.totalMarks) * 100));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{tests.length} tests logged · avg {avgPct.toFixed(1)}%</div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <Plus size={14} /> Add Test
        </button>
      </div>
      {showForm && <TestForm onSave={(f) => { onAdd(f); setShowForm(false); }} onCancel={() => setShowForm(false)} />}
      {tests.length > 1 && (
        <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>Score trend</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {tests.map((t, i) => {
              const pct = (t.score / t.totalMarks) * 100;
              return <div key={i} style={{ flex: 1, background: "#3B82F6", borderRadius: 3, height: `${Math.max(3, (pct / maxH) * 70)}px` }} title={`${pct.toFixed(1)}%`} />;
            })}
          </div>
        </div>
      )}
      {tests.length === 0 && <EmptyNote text="No tests logged yet." />}
      {[...tests].reverse().map((t, i) => {
        const pct = ((t.score / t.totalMarks) * 100).toFixed(1);
        const acc = t.correct + t.wrong > 0 ? ((t.correct / (t.correct + t.wrong)) * 100).toFixed(1) : "0";
        return (
          <div key={t.id} style={{ background: NAVY_CARD2, borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.testName}</span>
              <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{fmtDate(t.date)}</span>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: pct >= 60 ? "#22C55E" : pct >= 40 ? REVISION_GOLD : URGENT_RED }}>{pct}%</span>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                {t.score}/{t.totalMarks}<br />Accuracy {acc}%
              </div>
            </div>
            {t.weakAreas && <div style={{ fontSize: 11, color: URGENT_RED, marginTop: 6 }}>Weak: {t.weakAreas}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MODULE 6 — ANALYTICS PAGE
   ============================================================ */
function AnalyticsPage({ taskStates, ncertStates, revisionStates, pyqStates, mistakes, tests, today }) {
  const isDone = (t) => computeIsDone(taskStates[t.id]);
  const backlogPct = (BACKLOG_TASKS.filter(isDone).length / BACKLOG_TASKS.length) * 100;

  const ncertPct = (subj) => {
    const chapters = ncertChapters(subj);
    const prefix = subj === "Zoology" ? "ZOO" : "BOT";
    let done = 0, total = 0;
    NCERT_ROUND_SCHEDULE.forEach(({ round }) => chapters.forEach((ch, ci) => {
      total++; if (ncertStates[`NCERT-${prefix}-R${round}-${String(ci + 1).padStart(2, "0")}`]?.done) done++;
    }));
    return total ? (done / total) * 100 : 0;
  };
  const revisionPct = (subj) => {
    const chapters = subjectChapters(subj);
    const prefix = "REV-" + SUBJ_PREFIX[subj];
    let done = 0, total = 0;
    REVISION_ROUND_SCHEDULE.forEach(({ round }) => chapters.forEach((ch, ci) => {
      total++; if (revisionStates[`${prefix}-R${round}-${String(ci + 1).padStart(2, "0")}`]?.done) done++;
    }));
    return total ? (done / total) * 100 : 0;
  };
  const pyqDone = PYQ_YEARS.reduce((s, y) => s + SUBJECT_ORDER.filter(sub => pyqStates[`PYQ-${y}-${SUBJ_PREFIX[sub]}`]?.status === "Completed").length, 0);
  const pyqPct = (pyqDone / (PYQ_YEARS.length * SUBJECT_ORDER.length)) * 100;

  const mistakesBySubject = {};
  SUBJECT_ORDER.forEach(s => mistakesBySubject[s] = mistakes.filter(m => m.subject === s && m.status !== "Resolved").length);
  const avgTestPct = tests.length ? tests.reduce((s, t) => s + (t.score / t.totalMarks) * 100, 0) / tests.length : null;

  return (
    <div>
      <SectionHeader icon="🔥" title="BACKLOG OVERALL" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 14 }}>
        <ProgressBar pct={backlogPct} color="#F97316" height={10} />
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>{backlogPct.toFixed(1)}% cleared</div>
      </div>

      <SectionHeader icon="📖" title="NCERT COMPLETION" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 14 }}>
        {NCERT_SUBJECTS.map(s => (
          <div key={s} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: "var(--text-dim)" }}>{SUBJECT_STYLE[s].emoji} {s}</span>
              <span style={{ color: SUBJECT_STYLE[s].accent, fontWeight: 700 }}>{ncertPct(s).toFixed(0)}%</span>
            </div>
            <ProgressBar pct={ncertPct(s)} color={SUBJECT_STYLE[s].accent} height={6} />
          </div>
        ))}
      </div>

      <SectionHeader icon="🔄" title="REVISION COMPLETION" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 14 }}>
        {SUBJECT_ORDER.map(s => (
          <div key={s} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: "var(--text-dim)" }}>{SUBJECT_STYLE[s].emoji} {s}</span>
              <span style={{ color: SUBJECT_STYLE[s].accent, fontWeight: 700 }}>{revisionPct(s).toFixed(0)}%</span>
            </div>
            <ProgressBar pct={revisionPct(s)} color={SUBJECT_STYLE[s].accent} height={6} />
          </div>
        ))}
      </div>

      <SectionHeader icon="📜" title="PYQ COVERAGE" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 14 }}>
        <ProgressBar pct={pyqPct} color={REVISION_GOLD} height={10} />
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>{pyqPct.toFixed(1)}% of 1990–2026 covered</div>
      </div>

      <SectionHeader icon="❌" title="OPEN MISTAKES BY SUBJECT" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 14 }}>
        {SUBJECT_ORDER.map(s => (
          <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
            <span style={{ color: "var(--text-dim)" }}>{SUBJECT_STYLE[s].emoji} {s}</span>
            <span style={{ color: mistakesBySubject[s] > 0 ? URGENT_RED : "#22C55E", fontWeight: 700 }}>{mistakesBySubject[s]}</span>
          </div>
        ))}
      </div>

      <SectionHeader icon="📝" title="TEST PERFORMANCE" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14 }}>
        {avgTestPct === null
          ? <EmptyNote text="No tests logged yet." />
          : <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{avgTestPct.toFixed(1)}% <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 400 }}>avg across {tests.length} tests</span></div>}
      </div>
    </div>
  );
}

/* ============================================================
   MODULE — DPP TRACKER
   One DPP per planner lecture (609 total across 6 subjects).
   Reuses the same taskId + "dpp" field already on each lecture,
   so ticking here and ticking on a Backlog/Today card are the
   same underlying record — no duplicate data.
   ============================================================ */
function DppChapterList({ tasks, taskStates, onToggle, filter, openChapter, setOpenChapter, keyPrefix, accent }) {
  const visible = filter === "pending" ? tasks.filter(t => !taskStates[t.id]?.dpp) : tasks;
  const chapters = groupByChapter(visible);
  if (Object.keys(chapters).length === 0) return <EmptyNote text="Nothing here — all DPPs done for this filter." />;
  return (
    <div>
      {Object.entries(chapters).map(([ch, chTasks]) => {
        const chKey = keyPrefix + "::" + ch;
        const chOpen = openChapter === chKey;
        const chDone = chTasks.filter(t => taskStates[t.id]?.dpp).length;
        return (
          <div key={ch} style={{ marginBottom: 6 }}>
            <button onClick={() => setOpenChapter(chOpen ? null : chKey)} style={{ width: "100%", background: NAVY_CARD2, border: "none", borderRadius: 10, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 12.5, color: "var(--text-dim)", textAlign: "left" }}>{ch}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, marginLeft: 8 }}>{chDone}/{chTasks.length} DPPs</span>
            </button>
            {chOpen && (
              <div style={{ marginTop: 6 }}>
                {chTasks.map(t => {
                  const st = taskStates[t.id] || {};
                  const videoDone = !!st.video;
                  return (
                    <div key={t.id} onClick={() => onToggle(t, "dpp")} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", cursor: "pointer",
                      borderBottom: "1px solid var(--border2)", background: NAVY_CARD, borderRadius: 8, marginBottom: 4
                    }}>
                      <TickBox checked={!!st.dpp} size={19} color={accent} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: st.dpp ? "var(--text-muted)" : "var(--text)", textDecoration: st.dpp ? "line-through" : "none" }}>L{t.l} — {t.t}</div>
                        {!videoDone && <div style={{ fontSize: 10, color: URGENT_RED, marginTop: 1 }}>⚠ video not marked done yet</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DppPage({ taskStates, onToggle }) {
  const [subj, setSubj] = useState("Physics");
  const [filter, setFilter] = useState("pending");
  const [openChapter, setOpenChapter] = useState(null);
  const style = SUBJECT_STYLE[subj];

  const allTasks = PLANNER.filter(t => t.s === subj);
  const totalDone = allTasks.filter(t => taskStates[t.id]?.dpp).length;
  const pct = allTasks.length ? (totalDone / allTasks.length) * 100 : 0;

  const grandTotal = PLANNER.length;
  const grandDone = PLANNER.filter(t => taskStates[t.id]?.dpp).length;

  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 10 }}>
        One DPP per lecture — {grandTotal} lectures across all subjects, {grandDone} DPPs done ({((grandDone / grandTotal) * 100).toFixed(0)}%).
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {SUBJECT_ORDER.map(s => (
          <button key={s} onClick={() => { setSubj(s); setOpenChapter(null); }} style={{
            padding: "7px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: subj === s ? SUBJECT_STYLE[s].accent : NAVY_CARD,
            color: subj === s ? "var(--input-bg)" : "var(--text-dim)", fontSize: 11, fontWeight: 700
          }}>{SUBJECT_STYLE[s].emoji} {SUBJ_SHORT[s]}</button>
        ))}
      </div>

      <div style={{ background: NAVY_CARD2, borderRadius: 14, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <ProgressRing pct={pct} size={60} color={style.accent} />
        <div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{subj} — DPP progress</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{totalDone} / {allTasks.length} DPPs done</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setFilter("pending")} style={{
          flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
          background: filter === "pending" ? URGENT_RED : NAVY_CARD, color: filter === "pending" ? "#fff" : "var(--text-dim)",
          fontSize: 12, fontWeight: 700
        }}>Pending only</button>
        <button onClick={() => setFilter("all")} style={{
          flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
          background: filter === "all" ? style.accent : NAVY_CARD, color: filter === "all" ? "var(--input-bg)" : "var(--text-dim)",
          fontSize: 12, fontWeight: 700
        }}>All lectures</button>
      </div>

      <DppChapterList tasks={allTasks} taskStates={taskStates} onToggle={onToggle} filter={filter} openChapter={openChapter} setOpenChapter={setOpenChapter} keyPrefix={"DPP-" + subj} accent={style.accent} />
    </div>
  );
}

/* ============================================================
   DATA INTEGRITY CHECK — runTaskIntegrityCheck()
   Read-only diagnostic. Never deletes or modifies data.
   ============================================================ */
function runTaskIntegrityCheck(taskStates, missedRecords) {
  const issues = [];

  // duplicate Task IDs in planner
  const seen = new Set(); const dupes = new Set();
  PLANNER.forEach(t => { if (seen.has(t.id)) dupes.add(t.id); seen.add(t.id); });
  if (dupes.size > 0) issues.push({ level: "error", text: `Duplicate planner Task IDs: ${[...dupes].join(", ")}` });

  // missing required fields
  PLANNER.forEach(t => {
    if (!t.id || !t.s || !t.c || !t.t || !t.d) issues.push({ level: "error", text: `Task ${t.id || "(no id)"} missing a required field` });
  });

  // invalid dates
  PLANNER.forEach(t => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(t.d)) issues.push({ level: "error", text: `Task ${t.id} has invalid date format: ${t.d}` });
  });

  // orphaned missed-live records (original task no longer exists in planner)
  const plannerIds = new Set(PLANNER.map(t => t.id));
  missedRecords.forEach(m => {
    if (!plannerIds.has(m.originalTaskId)) issues.push({ level: "warn", text: `Missed-live record ${m.taskId} points to unknown task ${m.originalTaskId}` });
  });

  // duplicate missed-live records for same originalTaskId
  const missCount = {};
  missedRecords.forEach(m => { missCount[m.originalTaskId] = (missCount[m.originalTaskId] || 0) + 1; });
  Object.entries(missCount).forEach(([id, c]) => { if (c > 1) issues.push({ level: "error", text: `Duplicate missed-live records for ${id} (${c} copies)` }); });

  // completed tasks still appearing as pending (state says complete but flags don't match)
  Object.entries(taskStates).forEach(([id, st]) => {
    if (st.status === "Completed" && !(st.video && st.dpp && st.notes)) {
      issues.push({ level: "warn", text: `Task ${id} marked Completed but video/dpp/notes not all true` });
    }
    if (!plannerIds.has(id)) {
      issues.push({ level: "warn", text: `taskStates has orphaned entry for unknown task ${id}` });
    }
  });

  // invalid status values
  const validStatuses = ["In Progress", "Completed", undefined];
  Object.entries(taskStates).forEach(([id, st]) => {
    if (st.status && !validStatuses.includes(st.status)) issues.push({ level: "warn", text: `Task ${id} has unrecognized status "${st.status}"` });
  });

  // Sunday quota check on backlog schedule (spot-check)
  const sundayGroups = {};
  BACKLOG_TASKS.forEach(t => { if (isSunday(t.scheduledDate)) sundayGroups[t.scheduledDate] = (sundayGroups[t.scheduledDate] || 0) + 1; });
  Object.entries(sundayGroups).forEach(([d, c]) => { if (c > 3) issues.push({ level: "error", text: `Sunday ${d} has ${c} backlog lectures scheduled (should be max 3)` }); });
  const weekdayGroups = {};
  BACKLOG_TASKS.forEach(t => { if (!isSunday(t.scheduledDate)) weekdayGroups[t.scheduledDate] = (weekdayGroups[t.scheduledDate] || 0) + 1; });
  Object.entries(weekdayGroups).forEach(([d, c]) => { if (c > 2) issues.push({ level: "error", text: `Weekday ${d} has ${c} backlog lectures scheduled (should be max 2)` }); });

  return issues;
}

function IntegrityCheckPage({ taskStates, missedRecords }) {
  const issues = useMemo(() => runTaskIntegrityCheck(taskStates, missedRecords), [taskStates, missedRecords]);
  const errors = issues.filter(i => i.level === "error");
  const warnings = issues.filter(i => i.level === "warn");
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>
        Read-only check across {PLANNER.length} planner tasks, {Object.keys(taskStates).length} task states, {missedRecords.length} missed-live records. Nothing is ever deleted here.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div style={{ background: NAVY_CARD, borderRadius: 12, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: errors.length ? URGENT_RED : "#22C55E" }}>{errors.length}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Errors</div>
        </div>
        <div style={{ background: NAVY_CARD, borderRadius: 12, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: warnings.length ? REVISION_GOLD : "#22C55E" }}>{warnings.length}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Warnings</div>
        </div>
      </div>
      {issues.length === 0 && <EmptyNote text="✅ No integrity issues found." />}
      {issues.map((i, idx) => (
        <div key={idx} style={{
          background: NAVY_CARD2, borderRadius: 10, padding: 10, marginBottom: 6,
          borderLeft: `3px solid ${i.level === "error" ? URGENT_RED : REVISION_GOLD}`, fontSize: 12, color: "var(--text)"
        }}>{i.text}</div>
      ))}
    </div>
  );
}

/* ============================================================
   TASK DETAIL MODAL — full record + journey trail
   ============================================================ */
function ProofImageManager({ task, st, onAddProof, onRemoveProof }) {
  const [uploading, setUploading] = useState(false);
  const images = st.proofImages || [];

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onAddProof(task.id, reader.result);
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {images.map((img, idx) => (
          <div key={idx} style={{ position: "relative", width: 72, height: 72 }}>
            <img src={img} alt={`proof ${idx + 1}`} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
            <button onClick={() => onRemoveProof(task.id, idx)} style={{
              position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: 10, background: URGENT_RED,
              color: "#fff", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            }}>✕</button>
          </div>
        ))}
      </div>
      <label style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: NAVY_CARD, border: "1px dashed var(--border)",
        borderRadius: 8, padding: "8px 12px", fontSize: 11.5, color: "var(--text-dim)", cursor: "pointer"
      }}>
        📷 {uploading ? "Uploading…" : images.length ? "Add another photo" : "Attach proof photo"}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} disabled={uploading} />
      </label>
    </div>
  );
}

function TaskDetailModal({ task, taskStates, missedRecords, onClose, onAddProof, onRemoveProof, onSetRequireProof, onSetTaskNote, onSkipTask, onUnskipTask }) {
  const [noteDraft, setNoteDraft] = useState("");
  useEffect(() => {
    if (task) setNoteDraft(taskStates[task.id]?.taskNote || "");
  }, [task?.id]); // eslint-disable-line

  if (!task) return null;
  const st = taskStates[task.id] || {};
  const style = SUBJECT_STYLE[task.s];
  const isBacklog = !!task.scheduledDate;
  const missedRec = missedRecords.find(m => m.originalTaskId === task.id);
  const isDone = computeIsDone(st);
  const isSkipped = st.status === "Skipped";
  const proofCount = (st.proofImages || []).length;
  const proofBlocking = !!st.requireProof && proofCount === 0 && !isDone;

  const displayStatus = isSkipped ? "Skipped" : proofBlocking ? "Waiting for Proof" : (st.status || "Not Started");

  const steps = [
    { label: "Original", done: true, note: `Planner date ${fmtDate(task.d)} · ${task.tc}` },
  ];
  if (missedRec) steps.push({ label: "Missed", done: true, note: `Missed on ${fmtDate(missedRec.missedDate)}` });
  if (st.carryForwardCount > 0) steps.push({ label: "Carry Forward", done: true, note: `Carried forward ×${st.carryForwardCount}` });
  if (isBacklog || missedRec) steps.push({ label: "Rescheduled", done: true, note: isBacklog ? `Scheduled ${fmtDate(task.scheduledDate)}` : `New date ${fmtDate(missedRec?.newScheduledDate || "")}` });
  if (isSkipped) steps.push({ label: "Skipped", done: true, note: st.skipReason || "No reason given" });
  else steps.push({ label: "Completed", done: isDone, note: st.completedAt ? new Date(st.completedAt).toLocaleString("en-IN") : "Not yet" });

  const rows = [
    ["Task ID", task.id],
    ["Subject", task.s],
    ["Chapter", task.c],
    ["Topic", task.t],
    ["Lecture Number", task.l],
    ["Teacher", task.tc],
    ["Original Date", fmtDate(task.d)],
    ["Scheduled Date", isBacklog ? fmtDate(task.scheduledDate) : "—"],
    ["Duration", `${LECTURE_MIN} min`],
    ["Status", displayStatus],
    ["Priority", task.priority || "Medium"],
    ["Actual Study Time", st.actualHours ? `${st.actualHours}h` : "—"],
    ["Carry Forward Count", st.carryForwardCount || 0],
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: NAVY_BG, width: "100%", maxWidth: 640, margin: "0 auto", borderRadius: "20px 20px 0 0",
        maxHeight: "85vh", overflowY: "auto", padding: 18, borderTop: `3px solid ${style.accent}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <Pill text={`${style.emoji} ${style.label}`} color={style.accent} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginTop: 6 }}>{task.t}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{task.c}</div>
          </div>
          <button onClick={onClose} style={{ background: NAVY_CARD, border: "none", borderRadius: 8, padding: 8, cursor: "pointer" }}>
            <X size={16} color="var(--text-dim)" />
          </button>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>JOURNEY</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: s.done ? style.accent : "var(--border)", marginTop: 4 }} />
                {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 20 }} />}
              </div>
              <div style={{ paddingBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: s.done ? "var(--text)" : "var(--text-muted)" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>FULL RECORD</div>
        <div style={{ background: NAVY_CARD, borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", borderBottom: "1px solid var(--border2)", fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)" }}>{k}</span>
              <span style={{ color: "var(--text)", fontWeight: 600, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>NOTES</div>
        <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} onBlur={() => onSetTaskNote(task.id, noteDraft)}
          placeholder="Any notes for this lecture…" style={{
            width: "100%", minHeight: 60, background: NAVY_CARD, border: "1px solid var(--border)", borderRadius: 10,
            padding: 10, color: "var(--text)", fontSize: 12.5, marginBottom: 16
          }} />

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>PROOF OF COMPLETION</div>
        <div style={{ background: NAVY_CARD, borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={!!st.requireProof} onChange={e => onSetRequireProof(task.id, e.target.checked)} />
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Require a proof photo before this can be marked complete</span>
          </label>
          <ProofImageManager task={task} st={st} onAddProof={onAddProof} onRemoveProof={onRemoveProof} />
          {proofBlocking && <div style={{ fontSize: 11, color: REVISION_GOLD, marginTop: 8 }}>⚠ Attach at least one photo before ticking Video complete.</div>}
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          {["video", "dpp", "notes"].map(k => {
            const disabled = k === "video" && proofBlocking;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, opacity: disabled ? 0.4 : 1 }}>
                <TickBox checked={!!st[k]} size={17} color={style.accent} />
                <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{k === "video" ? "Video" : k === "dpp" ? "DPP" : "Notes"}</span>
              </div>
            );
          })}
        </div>

        {isSkipped ? (
          <button onClick={() => onUnskipTask(task.id)} style={{
            width: "100%", background: "none", color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: 10,
            padding: "10px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer"
          }}>Un-skip this task</button>
        ) : (
          <button onClick={() => { const reason = prompt("Reason for skipping (optional):") || ""; onSkipTask(task.id, reason); }} style={{
            width: "100%", background: "none", color: URGENT_RED, border: `1px solid ${URGENT_RED}55`, borderRadius: 10,
            padding: "10px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer"
          }}>Skip this task</button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SEARCH & FILTER
   ============================================================ */
function SearchPage({ taskStates, missedRecords, onToggle, onHours, onOpenDetail, today }) {
  const [q, setQ] = useState("");
  const [subjFilter, setSubjFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");   // All / Backlog / Live
  const [statusFilter, setStatusFilter] = useState("All"); // All / Completed / Pending / Carry Forward / Missed
  const isDone = (t) => computeIsDone(taskStates[t.id]);
  const missedIds = new Set(missedRecords.filter(m => !isDone({ id: m.originalTaskId })).map(m => m.originalTaskId));

  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    let pool = PLANNER;
    if (ql) pool = pool.filter(t =>
      t.id.toLowerCase().includes(ql) || t.s.toLowerCase().includes(ql) ||
      t.c.toLowerCase().includes(ql) || t.t.toLowerCase().includes(ql) || t.tc.toLowerCase().includes(ql)
    );
    if (subjFilter !== "All") pool = pool.filter(t => t.s === subjFilter);
    if (typeFilter === "Backlog") pool = pool.filter(t => t.d <= CUTOFF || t.d < today);
    if (typeFilter === "Live") pool = pool.filter(t => t.d > CUTOFF && t.d >= today);
    if (statusFilter === "Completed") pool = pool.filter(isDone);
    if (statusFilter === "Pending") pool = pool.filter(t => !isDone(t));
    if (statusFilter === "Carry Forward") pool = pool.filter(t => (taskStates[t.id]?.carryForwardCount || 0) > 0 && !isDone(t));
    if (statusFilter === "Missed") pool = pool.filter(t => missedIds.has(t.id));
    return pool.slice(0, 100);
  }, [q, subjFilter, typeFilter, statusFilter, taskStates, today]);

  const selectStyle = { background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 8px", color: "#fff", fontSize: 11.5 };

  return (
    <div>
      <input placeholder="Search by Task ID, subject, chapter, topic, teacher…" value={q} onChange={e => setQ(e.target.value)}
        style={{ width: "100%", background: NAVY_CARD, border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, marginBottom: 10 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
        <select value={subjFilter} onChange={e => setSubjFilter(e.target.value)} style={selectStyle}>
          <option>All</option>{SUBJECT_ORDER.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
          <option>All</option><option>Backlog</option><option>Live</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option>All</option><option>Completed</option><option>Pending</option><option>Carry Forward</option><option>Missed</option>
        </select>
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 8 }}>{results.length} result{results.length !== 1 ? "s" : ""} {results.length === 100 ? "(showing first 100)" : ""}</div>
      {results.length === 0 && <EmptyNote text="No matching tasks." />}
      {results.map(t => <TaskCard key={t.id} task={t} state={taskStates[t.id]} onToggle={onToggle} onHours={onHours} onOpenDetail={onOpenDetail} />)}
    </div>
  );
}

/* ============================================================
   PLANNER IMPORT
   Supports CSV rows matching: S.No, Batch Name, Subject,
   Sub-Subject, Chapter Name, Topic, Lecture Number, Date,
   Faculty Name. Validates before importing — never fabricates
   missing fields, never silently overwrites existing tasks.
   ============================================================ */
function parseImportCSV(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  // detect header row (contains "subject" case-insensitively)
  let startIdx = 0;
  if (/subject/i.test(lines[0])) startIdx = 1;
  const rows = [];
  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    // Expected: S.No, Batch Name, Subject, Sub-Subject, Chapter Name, Topic, Lecture Number, Date, Faculty Name
    if (cols.length < 8) { rows.push({ raw: lines[i], error: "Too few columns (need at least 8)" }); continue; }
    const [sno, batch, subject, subSubject, chapter, topic, lectureNo, date, faculty] = cols;
    rows.push({ raw: lines[i], sno, batch, subject: subject || null, subSubject: subSubject || null, chapter: chapter || null, topic: topic || null, lectureNo: lectureNo || null, date: date || null, faculty: faculty || null });
  }
  return rows;
}

function validateImportRow(row, existingKeys) {
  if (row.error) return { status: "invalid", reason: row.error };
  if (!row.subject || !row.chapter || !row.topic || !row.lectureNo || !row.date) {
    return { status: "invalid", reason: "Missing required field (Subject/Chapter/Topic/Lecture Number/Date)" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
    const d = new Date(row.date);
    if (isNaN(d.getTime())) return { status: "invalid", reason: `Unparseable date: "${row.date}"` };
  }
  const key = `${row.subject}|${row.chapter}|${row.topic}|${row.lectureNo}|${row.date}`.toLowerCase();
  if (existingKeys.has(key)) return { status: "duplicate", reason: "Already exists in planner (matched on subject+chapter+topic+lecture+date)" };
  return { status: "ok", key };
}

function PlannerImportPage({ importedPlanner, onImport }) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);

  const existingKeys = useMemo(() => {
    const set = new Set();
    [...PLANNER, ...importedPlanner].forEach(t => set.add(`${t.s}|${t.c}|${t.t}|${t.l}|${t.d}`.toLowerCase()));
    return set;
  }, [importedPlanner]);

  const runPreview = () => {
    const rows = parseImportCSV(text);
    const validated = rows.map(r => ({ ...r, ...validateImportRow(r, existingKeys) }));
    setPreview(validated);
  };

  const confirmImport = () => {
    if (!preview) return;
    const ok = preview.filter(r => r.status === "ok");
    const prefixMap = { "Physics": "IMPPHY", "Physical Chemistry": "IMPPCH", "Organic Chemistry": "IMPOCH", "Inorganic Chemistry": "IMPICH", "Zoology": "IMPZOO", "Botany": "IMPBOT" };
    const newTasks = ok.map((r, i) => {
      const prefix = prefixMap[r.subject] || "IMPOTH";
      const dateIso = /^\d{4}-\d{2}-\d{2}$/.test(r.date) ? r.date : new Date(r.date).toISOString().slice(0, 10);
      return {
        id: `${prefix}-${String(importedPlanner.length + i + 1).padStart(3, "0")}`,
        s: r.subject, c: r.chapter, t: r.topic, l: parseInt(r.lectureNo) || 0, d: dateIso, tc: r.faculty || "",
      };
    });
    onImport(newTasks);
    setPreview(null);
    setText("");
  };

  const counts = preview ? {
    ok: preview.filter(r => r.status === "ok").length,
    duplicate: preview.filter(r => r.status === "duplicate").length,
    invalid: preview.filter(r => r.status === "invalid").length,
  } : null;

  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 10 }}>
        Paste rows as: <b>S.No, Batch Name, Subject, Sub-Subject, Chapter Name, Topic, Lecture Number, Date (YYYY-MM-DD), Faculty Name</b>. Existing planner data is never altered.
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste CSV rows here…"
        style={{ width: "100%", minHeight: 120, background: NAVY_CARD, border: "1px solid var(--border)", borderRadius: 10, padding: 10, color: "#fff", fontSize: 12, marginBottom: 10, fontFamily: "monospace" }} />
      <button onClick={runPreview} disabled={!text.trim()} style={{ width: "100%", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 14, opacity: text.trim() ? 1 : 0.5 }}>
        Validate
      </button>

      {counts && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: NAVY_CARD, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#22C55E" }}>{counts.ok}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Ready to import</div>
            </div>
            <div style={{ background: NAVY_CARD, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: REVISION_GOLD }}>{counts.duplicate}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Duplicate</div>
            </div>
            <div style={{ background: NAVY_CARD, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: URGENT_RED }}>{counts.invalid}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Invalid</div>
            </div>
          </div>
          {preview.filter(r => r.status !== "ok").map((r, i) => (
            <div key={i} style={{ fontSize: 11, color: r.status === "invalid" ? URGENT_RED : REVISION_GOLD, padding: "5px 0", borderBottom: "1px solid var(--border2)" }}>
              [{r.status.toUpperCase()}] {r.raw?.slice(0, 60)}{r.raw?.length > 60 ? "…" : ""} — {r.reason}
            </div>
          ))}
          {counts.ok > 0 && (
            <button onClick={confirmImport} style={{ width: "100%", background: "#22C55E", color: "var(--input-bg)", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 12 }}>
              Import {counts.ok} valid row{counts.ok !== 1 ? "s" : ""}
            </button>
          )}
        </>
      )}

      {importedPlanner.length > 0 && (
        <>
          <SectionHeader icon="📥" title="PREVIOUSLY IMPORTED" count={importedPlanner.length} color="#3B82F6" />
          {importedPlanner.map(t => (
            <div key={t.id} style={{ background: NAVY_CARD2, borderRadius: 10, padding: 10, marginBottom: 6, fontSize: 11.5, color: "var(--text-dim)" }}>
              <b>{t.id}</b> · {t.s} — {t.c}: {t.t} (L{t.l}, {fmtDate(t.d)})
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ============================================================
   ORIGINAL PLANNER REFERENCE — read-only tables grouped into
   the three top-level categories the user asked for. Shows
   exactly what was supplied in the source planner PDFs (S.No,
   Chapter, Topic, Lecture #, Date, Faculty) — nothing invented.
   ============================================================ */
const PLANNER_GROUPS = {
  Physics: { subjects: ["Physics"], emoji: "⚡", accent: "#3B82F6" },
  Chemistry: { subjects: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"], emoji: "🧪", accent: "#14B8A6" },
  Biology: { subjects: ["Zoology", "Botany"], emoji: "🧬", accent: "#22C55E" },
};

function PlannerReferenceTable({ subj }) {
  const rows = PLANNER.filter(t => t.s === subj);
  const chapters = groupByChapter(rows);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: SUBJECT_STYLE[subj].accent, marginBottom: 8 }}>{SUBJECT_STYLE[subj].emoji} {subj} — {rows.length} lectures</div>
      {Object.entries(chapters).map(([ch, chRows]) => (
        <div key={ch} style={{ background: NAVY_CARD, borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{ch}</div>
          {chRows.map(r => (
            <div key={r.id} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: "1px solid var(--border2)", fontSize: 11 }}>
              <span style={{ color: "var(--text-muted)", width: 30, flexShrink: 0 }}>L{r.l}</span>
              <span style={{ flex: 1, color: "var(--text-dim)" }}>{r.t}</span>
              <span style={{ color: "var(--text-muted)", flexShrink: 0, whiteSpace: "nowrap" }}>{fmtDate(r.d)}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Faculty: {chRows[0].tc}</div>
        </div>
      ))}
    </div>
  );
}

function PlannerReferencePage({ group }) {
  const cfg = PLANNER_GROUPS[group];
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>
        Original planner data exactly as supplied — S.No, Chapter, Topic, Lecture Number, Date, Faculty. Read-only reference.
      </div>
      {cfg.subjects.map(s => <PlannerReferenceTable key={s} subj={s} />)}
    </div>
  );
}

/* ============================================================
   SETTINGS
   ============================================================ */
function DeleteAccountFlow({ onDeleted }) {
  const [step, setStep] = useState(0); // 0 = button, 1 = warning, 2 = type-to-confirm
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doDelete = async () => {
    setLoading(true); setError("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "Delete failed");
      await supabase.auth.signOut();
      onDeleted();
    } catch (e) {
      setError(e.message || "Something went wrong — your account was NOT deleted. Please try again.");
      setLoading(false);
    }
  };

  if (step === 0) {
    return (
      <button onClick={() => setStep(1)} style={{
        width: "100%", background: "none", color: URGENT_RED, border: `1px solid ${URGENT_RED}55`, borderRadius: 10,
        padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer"
      }}>Delete Account</button>
    );
  }
  if (step === 1) {
    return (
      <div style={{ background: `${URGENT_RED}12`, border: `1px solid ${URGENT_RED}55`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: URGENT_RED, marginBottom: 6 }}>Delete your account?</div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 12 }}>
          This will permanently remove your account and all associated personal data — backlog progress, NCERT/Revision/PYQ history, Mistake Book, tests, study hours. This cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setStep(2)} style={{ flex: 1, background: URGENT_RED, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Continue</button>
          <button onClick={() => setStep(0)} style={{ flex: 1, background: "var(--border2)", color: "var(--text-dim)", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: `${URGENT_RED}12`, border: `1px solid ${URGENT_RED}55`, borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>
        Type <b style={{ color: URGENT_RED }}>DELETE MY ACCOUNT</b> to confirm.
      </div>
      <input value={confirmText} onChange={e => setConfirmText(e.target.value)}
        style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)", fontSize: 13, marginBottom: 10 }} />
      {error && <div style={{ color: URGENT_RED, fontSize: 11.5, marginBottom: 10 }}>{error}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={doDelete} disabled={confirmText !== "DELETE MY ACCOUNT" || loading} style={{
          flex: 1, background: URGENT_RED, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12.5, fontWeight: 700,
          cursor: (confirmText === "DELETE MY ACCOUNT" && !loading) ? "pointer" : "default",
          opacity: (confirmText === "DELETE MY ACCOUNT" && !loading) ? 1 : 0.5
        }}>{loading ? "Deleting…" : "Permanently Delete"}</button>
        <button onClick={() => setStep(0)} style={{ flex: 1, background: "var(--border2)", color: "var(--text-dim)", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

function PlannerRecalcPanel({ backlogSettings, onApply, plannerLock }) {
  const [start, setStart] = useState(backlogSettings.backlogStartDate);
  const [weekday, setWeekday] = useState(backlogSettings.weekdayQuota);
  const [sunday, setSunday] = useState(backlogSettings.sundayQuota);
  const [preview, setPreview] = useState(null);
  const [confirmStep, setConfirmStep] = useState(false); // used by "Protected" tier
  const [passwordPrompt, setPasswordPrompt] = useState(false); // used by "Locked" tier
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const currentPreview = previewBacklogSchedule(backlogSettings.backlogStartDate, backlogSettings.weekdayQuota, backlogSettings.sundayQuota);

  const runPreview = () => {
    setPreview(previewBacklogSchedule(start, weekday, sunday));
  };

  const doApply = () => {
    onApply(start, weekday, sunday);
    setPreview(null);
    setConfirmStep(false);
    setPasswordPrompt(false);
  };

  const applyChange = async () => {
    if (plannerLock === "Locked") { setPasswordPrompt(true); return; }
    if (plannerLock === "Protected") { setConfirmStep(true); return; }
    doApply(); // Unlocked — apply immediately
  };

  const confirmWithPassword = async () => {
    setAuthError("");
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.auth.signInWithPassword({ email: userData.user.email, password });
      if (error) throw error;
      doApply();
      setPassword("");
    } catch (e) {
      setAuthError("Incorrect password — planner not changed.");
    }
  };

  return (
    <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, color: "var(--text)", marginBottom: 4 }}>Backlog start date</div>
      <input type="date" value={start} onChange={e => setStart(e.target.value)}
        style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, marginBottom: 10 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Mon–Sat / day</div>
          <input type="number" min="1" max="10" value={weekday} onChange={e => setWeekday(parseInt(e.target.value) || 1)}
            style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13 }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Sunday / day</div>
          <input type="number" min="1" max="10" value={sunday} onChange={e => setSunday(parseInt(e.target.value) || 1)}
            style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13 }} />
        </div>
      </div>

      <button onClick={runPreview} style={{
        width: "100%", background: "none", border: "1px solid var(--border)", color: "var(--text-dim)", borderRadius: 8,
        padding: "9px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginBottom: 10
      }}>Preview Impact</button>

      {preview && (
        <div style={{ background: NAVY_CARD2, borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 11.5 }}>
          <div style={{ color: "var(--text-dim)", marginBottom: 4 }}>
            Backlog start: <b style={{ color: "var(--text-muted)" }}>{fmtDate(backlogSettings.backlogStartDate)}</b> → <b style={{ color: REVISION_GOLD }}>{fmtDate(start)}</b>
          </div>
          <div style={{ color: "var(--text-dim)" }}>
            Estimated completion: <b style={{ color: "var(--text-muted)" }}>{fmtDate(currentPreview.endDate)}</b> → <b style={{ color: REVISION_GOLD }}>{fmtDate(preview.endDate)}</b>
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 6 }}>Your completed lectures are never affected — only future scheduling changes.</div>
        </div>
      )}

      {passwordPrompt ? (
        <div style={{ background: `${URGENT_RED}12`, border: `1px solid ${URGENT_RED}55`, borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginBottom: 6 }}>Planner is Locked — enter your password to confirm this change.</div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, marginBottom: 8 }} />
          {authError && <div style={{ color: URGENT_RED, fontSize: 11, marginBottom: 8 }}>{authError}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={confirmWithPassword} style={{ flex: 1, background: URGENT_RED, color: "#fff", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Confirm</button>
            <button onClick={() => { setPasswordPrompt(false); setPassword(""); }} style={{ flex: 1, background: "var(--border2)", color: "var(--text-dim)", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      ) : confirmStep ? (
        <div style={{ background: `${REVISION_GOLD}12`, border: `1px solid ${REVISION_GOLD}55`, borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginBottom: 8 }}>
            Planner is Protected — confirm this important change:<br />
            <b style={{ color: "var(--text-muted)" }}>{fmtDate(backlogSettings.backlogStartDate)}</b> → <b style={{ color: REVISION_GOLD }}>{fmtDate(start)}</b>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={doApply} style={{ flex: 1, background: REVISION_GOLD, color: "#0B1220", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Confirm &amp; Apply</button>
            <button onClick={() => setConfirmStep(false)} style={{ flex: 1, background: "var(--border2)", color: "var(--text-dim)", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={applyChange} style={{
          width: "100%", background: "#22C55E", color: "#0B1220", border: "none", borderRadius: 8,
          padding: "10px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer"
        }}>Recalculate Plan</button>
      )}
    </div>
  );
}

function VersionHistoryPanel({ versions }) {
  const [open, setOpen] = useState(false);
  if (versions.length === 0) return null;
  return (
    <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: 0, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <span style={{ fontSize: 12.5, color: "var(--text)", fontWeight: 700 }}>📜 Planner Version History ({versions.length})</span>
        {open ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{ marginTop: 10 }}>
          {[...versions].reverse().map(v => (
            <div key={v.version} style={{ background: NAVY_CARD2, borderRadius: 10, padding: 10, marginBottom: 6, fontSize: 11 }}>
              <div style={{ color: REVISION_GOLD, fontWeight: 700, marginBottom: 3 }}>Planner v{v.version} — {new Date(v.date).toLocaleString("en-IN")}</div>
              <div style={{ color: "var(--text-dim)" }}>Start: {fmtDate(v.previous.backlogStartDate)} → {fmtDate(v.next.backlogStartDate)}</div>
              <div style={{ color: "var(--text-dim)" }}>Quota: {v.previous.weekdayQuota}/{v.previous.sundayQuota} → {v.next.weekdayQuota}/{v.next.sundayQuota}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsPage({ themeMode, onChangeTheme, dailyTargetHours, onChangeTarget, examDate, onChangeExamDate, onExportData, userEmail, onLogout, backlogSettings, onApplyBacklogSettings, plannerLock, onChangePlannerLock, plannerVersions }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>APPEARANCE</div>
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 12.5, color: "var(--text)", marginBottom: 8 }}>Theme</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onChangeTheme("dark")} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: themeMode === "dark" ? "2px solid #3B82F6" : "1px solid var(--border)",
            background: "#0B1220", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}>🌙 Dark</button>
          <button onClick={() => onChangeTheme("light")} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, border: themeMode === "light" ? "2px solid #3B82F6" : "1px solid var(--border)",
            background: "#F3F5FA", color: "#0F172A", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}>☀️ Light</button>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>STUDY TARGETS</div>
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 12.5, color: "var(--text)", marginBottom: 6 }}>Daily study hours target</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <input type="range" min="1" max="18" step="0.5" value={dailyTargetHours} onChange={e => onChangeTarget(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: REVISION_GOLD, width: 44 }}>{dailyTargetHours}h</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text)", marginBottom: 6 }}>NEET UG 2027 exam date</div>
        <input type="date" value={examDate} onChange={e => onChangeExamDate(e.target.value)}
          style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13 }} />
        <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 5 }}>Update this once NTA announces the official date.</div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>PLANNER</div>
      <PlannerRecalcPanel backlogSettings={backlogSettings} onApply={onApplyBacklogSettings} plannerLock={plannerLock} />
      <VersionHistoryPanel versions={plannerVersions} />

      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 12.5, color: "var(--text)", marginBottom: 8 }}>🔒 Planner Lock</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Unlocked", "Protected", "Locked"].map(mode => (
            <button key={mode} onClick={() => onChangePlannerLock(mode)} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: plannerLock === mode ? "2px solid #3B82F6" : "1px solid var(--border)",
              background: "var(--input-bg)", color: "var(--text-dim)", fontSize: 11, fontWeight: 700, cursor: "pointer"
            }}>{mode === "Locked" ? "🔒 Locked" : mode === "Protected" ? "🛡️ Protected" : "🔓 Unlocked"}</button>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 8 }}>
          {plannerLock === "Locked" ? "Changing backlog start date or quota requires your password."
            : plannerLock === "Protected" ? "Important changes show a confirmation with current vs. new values first."
            : "Planner settings can be changed freely."}
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>ACCOUNT</div>
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Email</div>
        <div style={{ fontSize: 13.5, color: "var(--text)", marginBottom: 14 }}>{userEmail || "—"}</div>
        <button onClick={onExportData} style={{
          width: "100%", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "11px 0",
          fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 10
        }}>💾 Download My Data</button>
        <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginBottom: 16 }}>Every stored record — progress, hours, history, mistakes, tests — as one file.</div>
        <DeleteAccountFlow onDeleted={() => window.location.reload()} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>ABOUT / CREDITS</div>
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>NEET Command Center</div>
        <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 4 }}>Created &amp; Designed by <b>Ravi Nandan</b></div>
        <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 8 }}>Version 1.0.0</div>
        <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>{PLANNER.length} planner lectures loaded</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5 }}>
          Built with React, Vite, and Supabase. Icons by Lucide. This app does not claim ownership of third-party libraries, APIs, or educational content referenced within it.
        </div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 10 }}>© 2026 Ravi Nandan. All rights reserved.</div>
      </div>

      <button onClick={onLogout} style={{
        width: "100%", background: "none", color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: 10,
        padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer"
      }}>Log Out</button>
    </div>
  );
}

/* ============================================================
   LIVE COUNTDOWN — ticks every second, always running while the
   app is open, ends at the NEET 2027 exam date (Settings).
   ============================================================ */
function useCountdown(targetDateISO) {
  const [remaining, setRemaining] = useState(() => computeRemaining(targetDateISO));
  useEffect(() => {
    const id = setInterval(() => setRemaining(computeRemaining(targetDateISO)), 1000);
    return () => clearInterval(id);
  }, [targetDateISO]);
  return remaining;
}
function computeRemaining(targetDateISO) {
  const [y, m, d] = targetDateISO.split("-").map(Number);
  const target = new Date(y, m - 1, d, 9, 0, 0).getTime(); // assume 9:00 AM exam start
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, over: diff <= 0 };
}

function LiveCountdown({ examDate }) {
  const { days, hours, minutes, seconds, over } = useCountdown(examDate);
  const pad = (n) => String(n).padStart(2, "0");
  if (over) {
    return <div style={{ fontSize: 16, fontWeight: 700, color: "#22C55E" }}>🎉 Exam day is here — all the best!</div>;
  }
  const boxes = [
    { v: days, l: "DAYS" }, { v: pad(hours), l: "HRS" }, { v: pad(minutes), l: "MIN" }, { v: pad(seconds), l: "SEC" },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {boxes.map((b, i) => (
        <div key={i} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "8px 10px", minWidth: 52, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{b.v}</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 }}>{b.l}</div>
        </div>
      ))}
    </div>
  );
}

function LiveCountdownCompact({ examDate }) {
  const { days, hours, minutes, seconds, over } = useCountdown(examDate);
  const pad = (n) => String(n).padStart(2, "0");
  if (over) return <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E" }}>🎉 Today!</span>;
  return (
    <span style={{ fontSize: 12.5, fontWeight: 700, color: REVISION_GOLD, fontVariantNumeric: "tabular-nums" }}>
      {days}d {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}

/* ============================================================
   AI WEAK-SPOT HEATMAP
   Red/Yellow/Green per chapter, driven entirely by your own
   logged data: open Mistake Book entries (weighted more) and
   PYQ chapters tagged "High-Yield Repeater" that aren't done yet.
   No invented scores — purely a reflection of what you've logged.
   ============================================================ */
function computeHeatmap(mistakes, pyqStates) {
  const scoreByKey = {}; // "subject::chapter" -> score
  mistakes.filter(m => m.status !== "Resolved").forEach(m => {
    const key = `${m.subject}::${m.chapter}`;
    scoreByKey[key] = (scoreByKey[key] || 0) + (m.errorType === "Conceptual" ? 2 : 1);
  });
  return scoreByKey;
}
function heatColor(score) {
  if (!score) return "#22C55E";
  if (score <= 2) return REVISION_GOLD;
  return URGENT_RED;
}

function WeakSpotHeatmapPage({ mistakes, pyqStates }) {
  const scoreByKey = computeHeatmap(mistakes, pyqStates);
  const entries = Object.entries(scoreByKey).sort((a, b) => b[1] - a[1]);
  const highYieldPending = Object.entries(pyqStates).filter(([id, st]) => st.tier === "High-Yield Repeater" && st.status !== "Completed");

  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>
        Colour-coded from your own Mistake Book entries (weighted by error type) — 🟢 clean, 🟡 a couple of open mistakes, 🔴 recurring trouble spot. Not a guess — this is your own logged data.
      </div>
      {entries.length === 0 && <EmptyNote text="No open mistakes logged yet — heatmap will populate as you use the Mistake Book." />}
      {entries.map(([key, score]) => {
        const [subj, chapter] = key.split("::");
        const style = SUBJECT_STYLE[subj] || {};
        return (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, background: NAVY_CARD, borderRadius: 10, padding: 10, marginBottom: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: heatColor(score), flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--text)" }}>{style.emoji} {chapter}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{subj}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: heatColor(score) }}>{score} pt</span>
          </div>
        );
      })}

      {highYieldPending.length > 0 && (
        <>
          <SectionHeader icon="🔴" title="HIGH-YIELD PYQ REPEATERS — STILL PENDING" count={highYieldPending.length} color={URGENT_RED} />
          {highYieldPending.map(([id]) => {
            const [, year, prefix] = id.split("-");
            const subj = Object.entries(SUBJ_PREFIX).find(([, p]) => p === prefix)?.[0];
            return (
              <div key={id} style={{ fontSize: 11.5, color: "var(--text-dim)", padding: "6px 0", borderBottom: "1px solid var(--border2)" }}>
                {SUBJECT_STYLE[subj]?.emoji} {subj} — {year} tagged High-Yield Repeater, not solved yet
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

/* ============================================================
   TELEGRAM SYNC — public channel content matched to lectures.
   Fetches via our own Vercel serverless function (/api/telegram)
   since the browser can't call t.me directly (no CORS headers).
   Matching is suggested, not blind — you confirm each link so a
   wrong lecture is never silently attached.
   ============================================================ */
function guessMatchingTask(text, subjectTasks) {
  if (!text) return null;
  const lower = text.toLowerCase();
  let best = null, bestScore = 0;
  subjectTasks.forEach(t => {
    let score = 0;
    if (lower.includes(t.c.toLowerCase())) score += 2;
    if (lower.includes(t.t.toLowerCase())) score += 3;
    const lecPattern = new RegExp(`(lecture|lec|l)[\\s.-]?0*${t.l}\\b`, "i");
    if (lecPattern.test(text)) score += 2;
    if (score > bestScore) { bestScore = score; best = t; }
  });
  return bestScore >= 3 ? best : null;
}

const TELEGRAM_TEACHER_HINT = {
  "Physics": "Manish Raj Sir",
  "Physical Chemistry": "Sudhanshu Kumar Sir",
  "Organic Chemistry": "Pankaj Sijariya Sir",
  "Inorganic Chemistry": "Mohit Dadheech Sir",
  "Zoology": "Samapti Sinha Ma'am",
  "Botany": "Vipin Sharma Sir",
};

function TelegramSyncPage({ taskStates, onLinkTelegram, telegramChannels, onSaveChannel }) {
  const [subj, setSubj] = useState("Physics");
  const [channelInput, setChannelInput] = useState(telegramChannels[subj] || "");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [manualTaskId, setManualTaskId] = useState({});

  const subjectTasks = PLANNER.filter(t => t.s === subj);
  const style = SUBJECT_STYLE[subj];

  const switchSubject = (s) => {
    setSubj(s);
    setChannelInput(telegramChannels[s] || "");
    setMessages([]);
    setError("");
  };

  const fetchMessages = async (before) => {
    setLoading(true); setError("");
    try {
      const url = `/api/telegram?channel=${encodeURIComponent(channelInput)}${before ? `&before=${before}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => before ? [...prev, ...data.messages] : data.messages);
      onSaveChannel(subj, channelInput);
    } catch (e) {
      setError(e.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const filtered = search
    ? messages.filter(m => (m.text || "").toLowerCase().includes(search.toLowerCase()))
    : messages;

  const linkedCount = subjectTasks.filter(t => taskStates[t.id]?.telegramLink).length;

  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 10 }}>
        One channel per subject/teacher — pick the subject, enter that teacher's public channel username, fetch posts, and confirm each match. Nothing links automatically without your OK.
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {SUBJECT_ORDER.map(s => (
          <button key={s} onClick={() => switchSubject(s)} style={{
            padding: "7px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: subj === s ? SUBJECT_STYLE[s].accent : NAVY_CARD,
            color: subj === s ? "#0B1220" : "var(--text-dim)", fontSize: 11, fontWeight: 700
          }}>{SUBJECT_STYLE[s].emoji} {SUBJ_SHORT[s]}</button>
        ))}
      </div>

      <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 4 }}>
        {style.emoji} {subj} — usually {TELEGRAM_TEACHER_HINT[subj]}'s channel
      </div>
      <div style={{ fontSize: 11.5, color: REVISION_GOLD, marginBottom: 12 }}>{linkedCount} / {subjectTasks.length} {subj} lectures linked so far</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="channel username (without @)" value={channelInput} onChange={e => setChannelInput(e.target.value)}
          style={{ flex: 1, background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)", fontSize: 13 }} />
        <button onClick={() => fetchMessages(null)} disabled={!channelInput || loading} style={{
          background: style.accent, color: "#0B1220", border: "none", borderRadius: 8, padding: "9px 16px",
          fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: (!channelInput || loading) ? 0.5 : 1
        }}>{loading ? "Fetching…" : "Fetch"}</button>
      </div>

      {error && <div style={{ color: URGENT_RED, fontSize: 12, marginBottom: 12 }}>{error}</div>}

      {messages.length > 0 && (
        <>
          <input placeholder="Search fetched posts by text…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 12.5, marginBottom: 12 }} />

          {filtered.slice(0, 40).map(m => {
            const guess = guessMatchingTask(m.text, subjectTasks);
            const currentPick = manualTaskId[m.id] || (guess ? guess.id : "");
            return (
              <div key={m.id} style={{ background: NAVY_CARD, borderRadius: 12, padding: 12, marginBottom: 8, borderLeft: `3px solid ${style.accent}` }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                  {m.hasVideo && <Pill text="🎥 Video" color="#3B82F6" />}
                  {m.hasDocument && <Pill text={`📄 ${m.documentName || "Document"}`} color="#F97316" />}
                  {m.hasPhoto && <Pill text="🖼 Photo" color="#22C55E" />}
                  <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>{m.date ? fmtDate(m.date.slice(0, 10)) : ""}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8, maxHeight: 60, overflow: "hidden" }}>{m.text || "(no text)"}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <select value={currentPick} onChange={e => setManualTaskId(prev => ({ ...prev, [m.id]: e.target.value }))}
                    style={{ flex: 1, background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px", color: "var(--text-dim)", fontSize: 11 }}>
                    <option value="">— pick matching {subj} lecture —</option>
                    {subjectTasks.map(t => <option key={t.id} value={t.id}>L{t.l}: {t.t.slice(0, 45)}</option>)}
                  </select>
                  <button
                    disabled={!currentPick}
                    onClick={() => onLinkTelegram(currentPick, m.link, m.text)}
                    style={{ background: currentPick ? "#22C55E" : "var(--border)", color: currentPick ? "#0B1220" : "var(--text-muted)", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: currentPick ? "pointer" : "default" }}>
                    Link
                  </button>
                </div>
                {guess && !manualTaskId[m.id] && (
                  <div style={{ fontSize: 10, color: REVISION_GOLD, marginTop: 4 }}>💡 Suggested match — confirm above before linking.</div>
                )}
              </div>
            );
          })}
          <button onClick={() => fetchMessages(messages[messages.length - 1]?.id)} disabled={loading} style={{
            width: "100%", background: NAVY_CARD, color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 0", fontSize: 12.5, cursor: "pointer", marginTop: 8
          }}>{loading ? "Loading…" : "Load older posts"}</button>
        </>
      )}
    </div>
  );
}

/* ============================================================
   MODULE — ASSIGNMENTS (Phase 3)
   A separate entity from planner lectures — homework, self-set
   targets, anything with its own due date. Supports the same
   proof-of-completion pattern as lecture tasks.
   ============================================================ */
function computeAssignmentStatus(a, today) {
  if (a.status === "Completed") return "Completed";
  if (a.status === "Skipped") return "Skipped";
  if (a.dueDate && a.dueDate < today) return "Overdue";
  return a.status || "Not Started";
}

function AssignmentForm({ onSave, onCancel }) {
  const [f, setF] = useState({
    title: "", subject: "Physics", chapter: "", description: "",
    assignedDate: todayISO(), dueDate: todayISO(), priority: "Medium", durationMinutes: 60,
  });
  const upd = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  return (
    <div style={{ background: NAVY_CARD2, borderRadius: 14, padding: 14, marginBottom: 14 }}>
      <input placeholder="Assignment title" value={f.title} onChange={e => upd("title", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <select value={f.subject} onChange={e => upd("subject", e.target.value)} style={inputStyle}>
          {SUBJECT_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={f.priority} onChange={e => upd("priority", e.target.value)} style={inputStyle}>
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
      </div>
      <input placeholder="Chapter (optional)" value={f.chapter} onChange={e => upd("chapter", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8 }} />
      <textarea placeholder="Description / questions" value={f.description} onChange={e => upd("description", e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 8, minHeight: 50 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <div>
          <label style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Assigned date</label>
          <input type="date" value={f.assignedDate} onChange={e => upd("assignedDate", e.target.value)} style={{ ...inputStyle, width: "100%" }} />
        </div>
        <div>
          <label style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Due date</label>
          <input type="date" value={f.dueDate} onChange={e => upd("dueDate", e.target.value)} style={{ ...inputStyle, width: "100%" }} />
        </div>
      </div>
      <label style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Estimated duration (minutes)</label>
      <input type="number" value={f.durationMinutes} onChange={e => upd("durationMinutes", parseInt(e.target.value) || 0)} style={{ ...inputStyle, width: "100%", marginBottom: 10 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onSave(f)} disabled={!f.title.trim()} style={{ flex: 1, background: f.title.trim() ? "#3B82F6" : "var(--border)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: f.title.trim() ? "pointer" : "default" }}>Save</button>
        <button onClick={onCancel} style={{ flex: 1, background: "var(--border2)", color: "var(--text-dim)", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

function AssignmentCard({ a, today, onComplete, onSkip, onAddProof, onRemoveProof, onToggleRequireProof }) {
  const status = computeAssignmentStatus(a, today);
  const style = SUBJECT_STYLE[a.subject] || {};
  const priorityColor = a.priority === "High" ? URGENT_RED : a.priority === "Low" ? "#22C55E" : REVISION_GOLD;
  const statusColor = status === "Completed" ? "#22C55E" : status === "Overdue" ? URGENT_RED : status === "Skipped" ? "var(--text-muted)" : "#3B82F6";
  const proofBlocking = !!a.requireProof && !(a.proofImages && a.proofImages.length > 0) && status !== "Completed";
  const [showProof, setShowProof] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAddProof(a.id, reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ background: NAVY_CARD, borderRadius: 12, padding: 12, marginBottom: 8, borderLeft: `4px solid ${style.accent || "#64748B"}`, opacity: status === "Completed" || status === "Skipped" ? 0.6 : 1 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
        <Pill text={`${style.emoji || ""} ${a.subject}`} color={style.accent || "#64748B"} />
        <Pill text={a.priority} color={priorityColor} />
        <Pill text={status} color={statusColor} />
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)" }}>{a.title}</div>
      {a.chapter && <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 1 }}>{a.chapter}</div>}
      {a.description && <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 4 }}>{a.description}</div>}
      <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 6 }}>
        Assigned {fmtDate(a.assignedDate)} · Due {fmtDate(a.dueDate)} · ~{a.durationMinutes}min
      </div>

      {showProof && (
        <div style={{ marginTop: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={!!a.requireProof} onChange={e => onToggleRequireProof(a.id, e.target.checked)} />
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Require proof photo</span>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
            {(a.proofImages || []).map((img, idx) => (
              <div key={idx} style={{ position: "relative", width: 56, height: 56 }}>
                <img src={img} alt="proof" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                <button onClick={() => onRemoveProof(a.id, idx)} style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: 8, background: URGENT_RED, color: "#fff", border: "none", fontSize: 9, cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>
          <label style={{ display: "inline-block", fontSize: 10.5, color: "var(--text-dim)", background: NAVY_CARD2, border: "1px dashed var(--border)", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>
            📷 Add proof photo
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </label>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {status !== "Completed" && status !== "Skipped" && (
          <>
            <button onClick={() => proofBlocking ? setShowProof(true) : onComplete(a.id)} style={{
              flex: 1, background: proofBlocking ? "var(--border)" : "#22C55E", color: proofBlocking ? "var(--text-muted)" : "#0B1220",
              border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>{proofBlocking ? "🔒 Attach proof first" : "✓ Mark Complete"}</button>
            <button onClick={() => setShowProof(!showProof)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-dim)", borderRadius: 8, padding: "8px 10px", fontSize: 11, cursor: "pointer" }}>📷</button>
            <button onClick={() => onSkip(a.id)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "8px 10px", fontSize: 11, cursor: "pointer" }}>Skip</button>
          </>
        )}
      </div>
    </div>
  );
}

function AssignmentsPage({ assignments, today, onAdd, onComplete, onSkip, onAddProof, onRemoveProof, onToggleRequireProof }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("Active");

  const withStatus = assignments.map(a => ({ ...a, computedStatus: computeAssignmentStatus(a, today) }));
  const filtered = filter === "All" ? withStatus
    : filter === "Active" ? withStatus.filter(a => a.computedStatus !== "Completed" && a.computedStatus !== "Skipped")
    : withStatus.filter(a => a.computedStatus === filter);

  const overdueCount = withStatus.filter(a => a.computedStatus === "Overdue").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{assignments.length} total · {overdueCount} overdue</div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <Plus size={14} /> Add Assignment
        </button>
      </div>
      {showForm && <AssignmentForm onSave={(f) => { onAdd(f); setShowForm(false); }} onCancel={() => setShowForm(false)} />}

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {["Active", "All", "Overdue", "Completed", "Skipped"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            background: filter === f ? "#3B82F6" : NAVY_CARD, color: filter === f ? "#fff" : "var(--text-dim)", fontSize: 11, fontWeight: 700
          }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 && <EmptyNote text="No assignments here." />}
      {filtered.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || "")).map(a => (
        <AssignmentCard key={a.id} a={a} today={today} onComplete={onComplete} onSkip={onSkip} onAddProof={onAddProof} onRemoveProof={onRemoveProof} onToggleRequireProof={onToggleRequireProof} />
      ))}
    </div>
  );
}

function DashboardPage({ taskStates, studyHours, missedRecords, today, examDate, ncertStates, revisionStates, pyqStates }) {
  const isDone = (t) => computeIsDone(taskStates[t.id]);
  const combinedBySubject = {};
  SUBJECT_ORDER.forEach(s => { combinedBySubject[s] = effectiveBacklogForSubject(s, today, isDone); });
  const backlogTotal = Object.values(combinedBySubject).reduce((sum, arr) => sum + arr.length, 0);
  const backlogDone = Object.values(combinedBySubject).reduce((sum, arr) => sum + arr.filter(isDone).length, 0);
  const backlogPct = backlogTotal ? (backlogDone / backlogTotal) * 100 : 0;
  const { overdueBacklog, openMissed } = deriveCarryForward(today, taskStates, missedRecords);

  let activeSubj = null;
  for (const s of SUBJECT_ORDER) if (combinedBySubject[s].some(t => !isDone(t))) { activeSubj = s; break; }

  const last7 = useMemo(() => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const iso = addDays(today, -i);
      const h = studyHours[iso] || {};
      const total = Object.values(h).reduce((a, b) => a + (b || 0), 0);
      arr.push({ date: iso, hours: total });
    }
    return arr;
  }, [studyHours, today]);
  const maxH = Math.max(13, ...last7.map(x => x.hours));
  const weekTotal = last7.reduce((a, b) => a + b.hours, 0);

  const monthTotal = useMemo(() => {
    const monthPrefix = today.slice(0, 7);
    return Object.entries(studyHours).filter(([d]) => d.startsWith(monthPrefix))
      .reduce((sum, [, h]) => sum + Object.values(h).reduce((a, b) => a + (b || 0), 0), 0);
  }, [studyHours, today]);

  const subjectTotals = useMemo(() => {
    const totals = {}; SUBJECT_ORDER.forEach(s => totals[s] = 0);
    Object.values(studyHours).forEach(h => SUBJECT_ORDER.forEach(s => { totals[s] += (h[s] || 0); }));
    return totals;
  }, [studyHours]);

  const daysToExam = daysBetween(today, examDate);
  const { streak, todayCounted } = computeStreak(today, taskStates, ncertStates, revisionStates, pyqStates);

  return (
    <div>
      <StreakStrip streak={streak} todayCounted={todayCounted} />
      <div style={{ background: `linear-gradient(135deg, #1E3A5F, var(--input-bg))`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>⏳ NEET UG 2027 Countdown</div>
          <AlertTriangle size={20} color={overdueBacklog.length + openMissed.length > 5 ? URGENT_RED : "var(--text-muted)"} />
        </div>
        <LiveCountdown examDate={examDate} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
          <ProgressRing pct={backlogPct} size={76} color="#3B82F6" />
          <div>
            <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{backlogDone} / {backlogTotal} backlog lectures cleared</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Active: <b style={{ color: SUBJECT_STYLE[activeSubj]?.accent }}>{activeSubj || "All clear 🎉"}</b></div>
            <div style={{ fontSize: 12, color: URGENT_RED, marginTop: 2 }}>{overdueBacklog.length + openMissed.length} carry-forward items pending</div>
          </div>
        </div>
      </div>

      <SectionHeader icon="📊" title="SUBJECT-WISE BACKLOG" />
      {SUBJECT_ORDER.filter(s => combinedBySubject[s].length > 0).map(s => {
        const tasks = combinedBySubject[s];
        const done = tasks.filter(isDone).length;
        const pct = tasks.length ? (done / tasks.length) * 100 : 100;
        const style = SUBJECT_STYLE[s];
        return (
          <div key={s} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
              <span style={{ color: "var(--text-dim)" }}>{style.emoji} {s}</span>
              <span style={{ color: style.accent, fontWeight: 700 }}>{done}/{tasks.length}</span>
            </div>
            <ProgressBar pct={pct} color={style.accent} />
          </div>
        );
      })}

      <SectionHeader icon="📈" title="LAST 7 DAYS — STUDY HOURS" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {last7.map(d => (
            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", background: d.hours >= 13 ? "#22C55E" : "#3B82F6", borderRadius: 4, height: `${Math.max(3, (d.hours / maxH) * 80)}px` }} />
              <span style={{ fontSize: 9, color: "var(--text-muted)" }}>{dayName(d.date)}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12 }}>
          <span style={{ color: "var(--text-dim)" }}>Week: <b style={{ color: "#fff" }}>{weekTotal}h</b></span>
          <span style={{ color: "var(--text-dim)" }}>Month: <b style={{ color: "#fff" }}>{monthTotal}h</b></span>
          <span style={{ color: "var(--text-dim)" }}>Avg/day: <b style={{ color: "#fff" }}>{(weekTotal / 7).toFixed(1)}h</b></span>
        </div>
      </div>

      <SectionHeader icon="🧮" title="SUBJECT-WISE TOTAL HOURS (all time)" />
      <div style={{ background: NAVY_CARD, borderRadius: 14, padding: 14 }}>
        {SUBJECT_ORDER.map(s => (
          <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12.5 }}>
            <span style={{ color: "var(--text-dim)" }}>{SUBJECT_STYLE[s].emoji} {s}</span>
            <span style={{ color: SUBJECT_STYLE[s].accent, fontWeight: 700 }}>{subjectTotals[s]}h</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 10.5, color: "var(--text-muted)" }}>
        Built &amp; Designed by <b>Ravi Nandan</b> · © 2026 Ravi Nandan. All rights reserved.
      </div>
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "today", label: "Today", icon: Calendar },
  { key: "backlog", label: "Backlog", icon: Flame },
  { key: "more", label: "More", icon: MoreHorizontal },
];

const MORE_ITEMS = [
  { key: "physicsRef", label: "Physics Planner", icon: Zap, color: "#3B82F6" },
  { key: "chemistryRef", label: "Chemistry Planner", icon: FlaskConical, color: "#14B8A6" },
  { key: "biologyRef", label: "Biology Planner", icon: Dna, color: "#22C55E" },
  { key: "search", label: "Search & Filter", icon: Search, color: "#3B82F6" },
  { key: "assignments", label: "Assignments", icon: FileText, color: "#3B82F6" },
  { key: "dpp", label: "DPP Tracker", icon: FileText, color: "#F97316" },
  { key: "ncert", label: "NCERT 8x", icon: BookOpen, color: "#22C55E" },
  { key: "revision", label: "Revision 5x", icon: RefreshCw, color: REVISION_GOLD },
  { key: "pyq", label: "PYQ 37yr", icon: Target, color: REVISION_GOLD },
  { key: "mistakes", label: "Mistake Book", icon: X, color: URGENT_RED },
  { key: "tests", label: "Test Analysis", icon: TrendingUp, color: "#3B82F6" },
  { key: "analytics", label: "Analytics", icon: BarChart3, color: "#14B8A6" },
  { key: "heatmap", label: "Weak-Spot Heatmap", icon: AlertTriangle, color: REVISION_GOLD },
  { key: "history", label: "History", icon: HistoryIcon, color: "var(--text-muted)" },
  { key: "completedHistory", label: "Completed History", icon: CheckCircle2, color: "#22C55E" },
  { key: "integrity", label: "Integrity Check", icon: AlertTriangle, color: URGENT_RED },
  { key: "import", label: "Import Planner", icon: Upload, color: "#14B8A6" },
  { key: "settings", label: "Settings", icon: Settings, color: "var(--text-muted)" },
  { key: "telegram", label: "Telegram Sync", icon: Search, color: "#3B82F6" },
];

function MoreMenu({ onOpen }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 14 }}>All tracking modules</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {MORE_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => onOpen(item.key)} style={{
              background: NAVY_CARD, border: `1px solid ${item.color}33`, borderRadius: 14, padding: 18,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer"
            }}>
              <Icon size={26} color={item.color} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", textAlign: "center" }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubPageHeader({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <button onClick={onBack} style={{ background: NAVY_CARD, border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex" }}>
        <ArrowLeft size={16} color="var(--text-dim)" />
      </button>
      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{title}</span>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("today");
  const [moreTab, setMoreTab] = useState(null);
  const [taskStates, setTaskStates] = useState({});
  const [studyHours, setStudyHoursState] = useState({});
  const [history, setHistory] = useState([]);
  const [missedRecords, setMissedRecords] = useState([]);
  const [ncertStates, setNcertStates] = useState({});
  const [revisionStates, setRevisionStates] = useState({});
  const [pyqStates, setPyqStates] = useState({});
  const [mistakes, setMistakes] = useState([]);
  const [tests, setTests] = useState([]);
  const [importedPlanner, setImportedPlanner] = useState([]);
  const [spacedStates, setSpacedStates] = useState({});
  const [completedHistory, setCompletedHistory] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [backlogSettings, setBacklogSettings] = useState({ backlogStartDate: "2026-08-20", weekdayQuota: 2, sundayQuota: 3 });
  const [plannerLock, setPlannerLock] = useState("Unlocked");
  const [plannerVersions, setPlannerVersions] = useState([]);
  const [dueDateOverrides, setDueDateOverrides] = useState({});
  const [scheduleVersion, setScheduleVersion] = useState(0); // bump to force re-render after recomputeBacklogSchedule
  const [isBufferDay, setIsBufferDay] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [themeMode, setThemeMode] = useState("dark");
  const [dailyTargetHours, setDailyTargetHours] = useState(13);
  const [examDate, setExamDate] = useState(EXAM_DATE_DEFAULT);
  const [telegramChannels, setTelegramChannels] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const today = todayISO();
  const theme = THEMES[themeMode];

  const pushHistory = useCallback((text) => {
    setHistory(prev => {
      const next = [...prev, { text, ts: Date.now() }].slice(-2500);
      saveBlob("history", next);
      return next;
    });
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const [ts, sh, hi, mr, settings, ncs, revs, pyqs, mist, tsts, impPlan, spaced, backlogTrend, compHist, assigns, versions, overrides] = await Promise.all([
        loadBlob("taskStates", {}),
        loadBlob("studyHours", {}),
        loadBlob("history", []),
        loadBlob("missedLiveRecords", []),
        loadBlob("appSettings", { lastGoalGenDate: null }),
        loadBlob("ncertStates", {}),
        loadBlob("revisionStates", {}),
        loadBlob("pyqStates", {}),
        loadBlob("mistakes", []),
        loadBlob("tests", []),
        loadBlob("importedPlanner", []),
        loadBlob("spacedStates", {}),
        loadBlob("backlogTrend", {}),
        loadBlob("completedHistory", []),
        loadBlob("assignments", []),
        loadBlob("plannerVersions", []),
        loadBlob("dueDateOverrides", {}),
      ]);

      // Idempotent daily automation: only runs once per day per device.
      let newMissed = mr;
      let newHistory = hi;
      let newTaskStates = ts;
      if (settings.lastGoalGenDate !== today) {
        const localHistory = [];
        const localPush = (text) => localHistory.push({ text, ts: Date.now() });
        newMissed = processMissedLive(today, mr, ts, localPush);

        // Carry-Forward Count: every task still overdue & incomplete gets its
        // count bumped once per day this automation runs (idempotent — guarded
        // by lastGoalGenDate, so this whole block fires at most once per date).
        newTaskStates = { ...ts };
        const isDoneLocal = (t) => computeIsDone(newTaskStates[t.id]);
        const overdueNow = [
          ...BACKLOG_TASKS.filter(t => t.scheduledDate < today && !isDoneLocal(t)),
          ...newMissed.filter(m => !isDoneLocal({ id: m.originalTaskId })),
        ];
        overdueNow.forEach(t => {
          const id = t.id || t.originalTaskId;
          const cur = newTaskStates[id] || {};
          const newCount = (cur.carryForwardCount || 0) + 1;
          newTaskStates[id] = { ...cur, carryForwardCount: newCount };
          if (newCount === 1 || newCount % 3 === 0) {
            localPush(`↪️ Carried forward (x${newCount}) — ${(PLANNER.find(p => p.id === id) || {}).s || ""} ${id}`);
          }
        });
        if (overdueNow.length) await saveBlob("taskStates", newTaskStates);

        // Burnout tracking: snapshot today's total pending backlog+rollover
        // count, then check whether it grew for 3 straight recorded days —
        // if so, tomorrow becomes an automatic Buffer & Recovery Day.
        const pendingCountToday = SUBJECT_ORDER.reduce((sum, subj) => {
          return sum + effectiveBacklogForSubject(subj, today, isDoneLocal).filter(t => !isDoneLocal(t)).length;
        }, 0);
        var newBacklogTrend = { ...backlogTrend, [today]: pendingCountToday };
        await saveBlob("backlogTrend", newBacklogTrend);

        newHistory = [...hi, ...localHistory].slice(-2500);
        if (localHistory.length) {
          await saveBlob("missedLiveRecords", newMissed);
          await saveBlob("history", newHistory);
        }
        await saveBlob("appSettings", { ...settings, lastGoalGenDate: today });
      }

      const bufferToday = checkBurnoutTrend(newBacklogTrend || backlogTrend, today);
      setIsBufferDay(bufferToday);

      setTaskStates(newTaskStates);
      setStudyHoursState(sh);
      setHistory(newHistory);
      setMissedRecords(newMissed);
      setNcertStates(ncs);
      setRevisionStates(revs);
      setPyqStates(pyqs);
      setMistakes(mist);
      setTests(tsts);
      setThemeMode(settings.themeMode || "dark");
      setDailyTargetHours(settings.dailyTargetHours || 13);
      setExamDate(settings.examDate || EXAM_DATE_DEFAULT);
      setTelegramChannels(settings.telegramChannels || {});

      const loadedBacklogSettings = {
        backlogStartDate: settings.backlogStartDate || "2026-08-20",
        weekdayQuota: settings.weekdayQuota || 2,
        sundayQuota: settings.sundayQuota || 3,
      };
      setBacklogSettings(loadedBacklogSettings);
      setPlannerLock(settings.plannerLock || "Unlocked");
      recomputeBacklogSchedule(loadedBacklogSettings.backlogStartDate, loadedBacklogSettings.weekdayQuota, loadedBacklogSettings.sundayQuota);
      setImportedPlanner(impPlan);
      setSpacedStates(spaced);
      setCompletedHistory(compHist);
      setAssignments(assigns);
      setPlannerVersions(versions);
      setDueDateOverrides(overrides);
      setLoaded(true);
    })();
  }, []); // eslint-disable-line

  const onToggle = useCallback((task, field) => {
    setTaskStates(prev => {
      const cur = prev[task.id] || {};
      const newVal = !cur[field];

      // Proof gate: if this task requires proof, block ticking "video" true
      // until at least one proof image is attached. Never blocks un-ticking.
      if (field === "video" && newVal && cur.requireProof && !(cur.proofImages && cur.proofImages.length > 0)) {
        pushHistory(`⚠️ Blocked — proof required before completing ${task.s} L${task.l}: ${task.t}`);
        return prev;
      }

      const updated = { ...cur, [field]: newVal };
      if (!updated.createdAt) updated.createdAt = new Date().toISOString();
      if (updated.video && updated.dpp && updated.notes && !cur.completedAt) {
        updated.completedAt = new Date().toISOString();
        updated.status = "Completed";
      } else if (!(updated.video && updated.dpp && updated.notes)) {
        updated.status = updated.status === "Skipped" ? "Skipped" : "In Progress";
        delete updated.completedAt;
      }
      const next = { ...prev, [task.id]: updated };
      saveBlob("taskStates", next);
      pushHistory(`${newVal ? "✅" : "↩️"} ${field.toUpperCase()} ${newVal ? "done" : "unmarked"} — ${task.s} L${task.l}: ${task.t}`);
      if (updated.status === "Completed" && cur.status !== "Completed") {
        pushHistory(`🏁 COMPLETED — ${task.s} L${task.l}: ${task.t}`);
        recordCompletedHistory(task, updated);
      }
      return next;
    });
  }, [pushHistory]);

  // Structured, de-duplicated completion record — separate from the free-text
  // activity log, meant for Analytics/export. Only ever written once per task.
  const recordCompletedHistory = useCallback((task, updatedState) => {
    setCompletedHistory(prev => {
      if (prev.some(r => r.taskId === task.id)) return prev; // no duplicates, ever
      const record = {
        taskId: task.id, title: task.t, subject: task.s, chapter: task.c,
        completionTime: updatedState.completedAt, durationMinutes: (updatedState.actualHours || 0) * 60,
        proofRef: (updatedState.proofImages && updatedState.proofImages.length) ? `${updatedState.proofImages.length} photo(s)` : null,
      };
      const next = [...prev, record];
      saveBlob("completedHistory", next);
      return next;
    });
  }, []);

  const onAddProof = useCallback((taskId, imageDataUrl) => {
    setTaskStates(prev => {
      const cur = prev[taskId] || {};
      const images = [...(cur.proofImages || []), imageDataUrl];
      const next = { ...prev, [taskId]: { ...cur, proofImages: images } };
      saveBlob("taskStates", next);
      pushHistory(`📷 Proof photo added — ${taskId}`);
      return next;
    });
  }, [pushHistory]);

  const onRemoveProof = useCallback((taskId, index) => {
    setTaskStates(prev => {
      const cur = prev[taskId] || {};
      const images = (cur.proofImages || []).filter((_, i) => i !== index);
      const next = { ...prev, [taskId]: { ...cur, proofImages: images } };
      saveBlob("taskStates", next);
      return next;
    });
  }, []);

  const onSetRequireProof = useCallback((taskId, required) => {
    setTaskStates(prev => {
      const cur = prev[taskId] || {};
      const next = { ...prev, [taskId]: { ...cur, requireProof: required } };
      saveBlob("taskStates", next);
      return next;
    });
  }, []);

  const onSetTaskNote = useCallback((taskId, note) => {
    setTaskStates(prev => {
      const cur = prev[taskId] || {};
      if (cur.taskNote === note) return prev;
      const next = { ...prev, [taskId]: { ...cur, taskNote: note } };
      saveBlob("taskStates", next);
      return next;
    });
  }, []);

  const onSkipTask = useCallback((taskId, reason) => {
    setTaskStates(prev => {
      const cur = prev[taskId] || {};
      const next = { ...prev, [taskId]: { ...cur, status: "Skipped", skipReason: reason || "" } };
      saveBlob("taskStates", next);
      const task = PLANNER.find(t => t.id === taskId);
      pushHistory(`⏭️ SKIPPED — ${task ? `${task.s} L${task.l}: ${task.t}` : taskId}${reason ? ` (${reason})` : ""}`);
      return next;
    });
  }, [pushHistory]);

  const onUnskipTask = useCallback((taskId) => {
    setTaskStates(prev => {
      const cur = prev[taskId] || {};
      const next = { ...prev, [taskId]: { ...cur, status: "In Progress", skipReason: "" } };
      saveBlob("taskStates", next);
      return next;
    });
  }, []);

  const onAddAssignment = useCallback((f) => {
    setAssignments(prev => {
      const rec = { ...f, id: `ASG-${Date.now()}`, status: "Not Started", proofImages: [], requireProof: false, createdAt: new Date().toISOString() };
      const next = [...prev, rec];
      saveBlob("assignments", next);
      pushHistory(`📚 Assignment added — ${f.title}`);
      return next;
    });
  }, [pushHistory]);

  const onCompleteAssignment = useCallback((id) => {
    setAssignments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, status: "Completed", completedAt: new Date().toISOString() } : a);
      saveBlob("assignments", next);
      const a = next.find(x => x.id === id);
      if (a) pushHistory(`✅ Assignment completed — ${a.title}`);
      return next;
    });
  }, [pushHistory]);

  const onSkipAssignment = useCallback((id) => {
    setAssignments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, status: "Skipped" } : a);
      saveBlob("assignments", next);
      return next;
    });
  }, []);

  const onAddAssignmentProof = useCallback((id, imageDataUrl) => {
    setAssignments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, proofImages: [...(a.proofImages || []), imageDataUrl] } : a);
      saveBlob("assignments", next);
      return next;
    });
  }, []);

  const onRemoveAssignmentProof = useCallback((id, index) => {
    setAssignments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, proofImages: (a.proofImages || []).filter((_, i) => i !== index) } : a);
      saveBlob("assignments", next);
      return next;
    });
  }, []);

  const onToggleAssignmentRequireProof = useCallback((id, required) => {
    setAssignments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, requireProof: required } : a);
      saveBlob("assignments", next);
      return next;
    });
  }, []);

  const updateSettings = useCallback(async (patch) => {
    const current = await loadBlob("appSettings", { lastGoalGenDate: null });
    await saveBlob("appSettings", { ...current, ...patch });
  }, []);

  const onApplyBacklogSettings = useCallback((startDate, weekdayQuota, sundayQuota) => {
    setBacklogSettings(prevSettings => {
      recomputeBacklogSchedule(startDate, weekdayQuota, sundayQuota);
      const next = { backlogStartDate: startDate, weekdayQuota, sundayQuota };
      setPlannerVersions(prevVersions => {
        const versionRecord = { version: prevVersions.length + 1, date: new Date().toISOString(), previous: prevSettings, next };
        const nextVersions = [...prevVersions, versionRecord];
        saveBlob("plannerVersions", nextVersions);
        return nextVersions;
      });
      setScheduleVersion(v => v + 1); // force all consumers to re-render with new schedule
      updateSettings(next);
      pushHistory(`⚙️ Planner recalculated — start ${fmtDate(startDate)}, ${weekdayQuota}/day weekday, ${sundayQuota}/day Sunday`);
      return next;
    });
  }, [pushHistory, updateSettings]);

  const onChangePlannerLock = useCallback((mode) => {
    setPlannerLock(mode);
    updateSettings({ plannerLock: mode });
    pushHistory(`🔒 Planner lock set to ${mode}`);
  }, [pushHistory, updateSettings]);

  const setSubjectHours = useCallback((date, subject, hours) => {
    setStudyHoursState(prev => {
      const next = { ...prev, [date]: { ...(prev[date] || {}), [subject]: hours } };
      saveBlob("studyHours", next);
      return next;
    });
    pushHistory(`⏱️ ${subject}: logged ${hours}h on ${fmtDate(date)}`);
  }, [pushHistory]);

  const onTaskHours = useCallback((task, hours) => {
    setTaskStates(prev => {
      const cur = prev[task.id] || {};
      const updated = { ...cur, actualHours: hours };
      const next = { ...prev, [task.id]: updated };
      saveBlob("taskStates", next);
      pushHistory(`⏱️ ${hours}h logged — ${task.s} L${task.l}: ${task.t}`);
      return next;
    });
  }, [pushHistory]);

  const onNcertToggle = useCallback((taskId, subj, chapter, round) => {
    setNcertStates(prev => {
      const cur = prev[taskId] || {};
      const newVal = !cur.done;
      const updated = { ...cur, done: newVal, completedAt: newVal ? new Date().toISOString() : null };
      const next = { ...prev, [taskId]: updated };
      saveBlob("ncertStates", next);
      pushHistory(`${newVal ? "📖✅" : "📖↩️"} NCERT R${round} ${newVal ? "done" : "unmarked"} — ${subj}: ${chapter}`);
      return next;
    });
  }, [pushHistory]);

  const onRevisionToggle = useCallback((taskId, subj, chapter, round) => {
    setRevisionStates(prev => {
      const cur = prev[taskId] || {};
      const newVal = !cur.done;
      const updated = { ...cur, done: newVal, completedAt: newVal ? new Date().toISOString() : null };
      const next = { ...prev, [taskId]: updated };
      saveBlob("revisionStates", next);
      pushHistory(`${newVal ? "🔄✅" : "🔄↩️"} Revision R${round} ${newVal ? "done" : "unmarked"} — ${subj}: ${chapter}`);
      return next;
    });
  }, [pushHistory]);

  const onRescheduleDue = useCallback((taskId, newDate) => {
    setDueDateOverrides(prev => {
      const next = { ...prev, [taskId]: newDate };
      saveBlob("dueDateOverrides", next);
      pushHistory(`📅 Rescheduled ${taskId} to ${fmtDate(newDate)} (was overdue)`);
      return next;
    });
  }, [pushHistory]);

  const onPyqUpdate = useCallback((taskId, year, subj, patch) => {
    setPyqStates(prev => {
      const cur = prev[taskId] || {};
      const updated = { ...cur, ...patch };
      if (patch.status === "Completed" && !cur.completedAt) updated.completedAt = new Date().toISOString();
      if (patch.status === "Not Started") updated.completedAt = null;
      const next = { ...prev, [taskId]: updated };
      saveBlob("pyqStates", next);
      if (patch.status) pushHistory(`📜 PYQ ${year} ${subj} — ${patch.status}`);
      if (patch.tier) pushHistory(`🎯 PYQ ${year} ${subj} tagged ${patch.tier}`);
      return next;
    });
  }, [pushHistory]);

  const onAddMistake = useCallback((f) => {
    setMistakes(prev => {
      const rec = { ...f, id: `MIST-${Date.now()}`, status: "Open" };
      const next = [...prev, rec];
      saveBlob("mistakes", next);
      pushHistory(`❌ Mistake logged — ${f.subject}: ${f.chapter}`);
      return next;
    });
  }, [pushHistory]);

  const onResolveMistake = useCallback((id) => {
    setMistakes(prev => {
      const next = prev.map(m => m.id === id ? { ...m, status: m.status === "Resolved" ? "Open" : "Resolved" } : m);
      saveBlob("mistakes", next);
      return next;
    });
  }, []);

  const onConvertMistakeToRevision = useCallback((id) => {
    setMistakes(prev => {
      const newRetest = addDays(todayISO(), 3);
      const next = prev.map(m => m.id === id ? { ...m, retestDate: newRetest, needsRevision: true } : m);
      saveBlob("mistakes", next);
      const m = next.find(x => x.id === id);
      if (m) pushHistory(`🔁 Mistake scheduled for revision on ${fmtDate(newRetest)} — ${m.subject}: ${m.chapter}`);
      return next;
    });
  }, [pushHistory]);

  const onAddTest = useCallback((f) => {
    setTests(prev => {
      const rec = { ...f, id: `TEST-${Date.now()}`, percentage: (f.score / f.totalMarks) * 100 };
      const next = [...prev, rec];
      saveBlob("tests", next);
      pushHistory(`📝 Test logged — ${f.testName}: ${rec.percentage.toFixed(1)}%`);
      return next;
    });
  }, [pushHistory]);

  const onSpacedToggle = useCallback((taskId, interval) => {
    setSpacedStates(prev => {
      const cur = prev[taskId] || {};
      const next = { ...prev, [taskId]: { ...cur, [`r${interval}`]: true } };
      saveBlob("spacedStates", next);
      pushHistory(`🔁 ${interval}-day revision done — ${taskId}`);
      return next;
    });
  }, [pushHistory]);

  const onLinkTelegram = useCallback((taskId, link, text) => {
    setTaskStates(prev => {
      const cur = prev[taskId] || {};
      const next = { ...prev, [taskId]: { ...cur, telegramLink: link, telegramText: text } };
      saveBlob("taskStates", next);
      const task = PLANNER.find(t => t.id === taskId);
      pushHistory(`📺 Linked Telegram post — ${task ? `${task.s} L${task.l}: ${task.t}` : taskId}`);
      return next;
    });
  }, [pushHistory]);

  const onSaveTelegramChannel = useCallback((subj, channel) => {
    setTelegramChannels(prev => {
      const next = { ...prev, [subj]: channel };
      updateSettings({ telegramChannels: next });
      return next;
    });
  }, [updateSettings]);

  const onImportPlanner = useCallback((newTasks) => {
    setImportedPlanner(prev => {
      const next = [...prev, ...newTasks];
      saveBlob("importedPlanner", next);
      pushHistory(`📥 Imported ${newTasks.length} planner row(s)`);
      return next;
    });
  }, [pushHistory]);

  const onChangeTheme = useCallback((mode) => {
    setThemeMode(mode);
    updateSettings({ themeMode: mode });
    pushHistory(`🎨 Theme changed to ${mode}`);
  }, [pushHistory, updateSettings]);

  const onChangeTarget = useCallback((hours) => {
    setDailyTargetHours(hours);
    updateSettings({ dailyTargetHours: hours });
    pushHistory(`⚙️ Daily study target changed to ${hours}h`);
  }, [pushHistory, updateSettings]);

  const onChangeExamDate = useCallback((date) => {
    setExamDate(date);
    updateSettings({ examDate: date });
    pushHistory(`⚙️ Exam date set to ${fmtDate(date)}`);
  }, [pushHistory, updateSettings]);

  const onExportData = useCallback(async () => {
    const keys = ["taskStates", "studyHours", "history", "missedLiveRecords", "appSettings", "ncertStates", "revisionStates", "pyqStates", "mistakes", "tests", "importedPlanner"];
    const dump = {};
    for (const k of keys) dump[k] = await loadBlob(k, null);
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `neet-2027-backup-${today}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushHistory("💾 Exported full data backup");
  }, [today, pushHistory]);

  const onLogout = useCallback(() => {
    supabase.auth.signOut();
  }, []);

  if (!loaded) {
    return <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textMuted }}>Loading your command center…</div>;
  }

  const rootVars = {
    "--bg": theme.bg, "--card": theme.card, "--card2": theme.card2,
    "--text": theme.text, "--text-dim": theme.textDim, "--text-muted": theme.textMuted,
    "--border": theme.border, "--border2": theme.border2, "--input-bg": theme.inputBg, "--nav-bg": theme.navBg,
  };

  return (
    <div style={{ ...rootVars, minHeight: "100vh", background: "var(--bg)", fontFamily: "Inter, system-ui, sans-serif", paddingBottom: 76 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg)", borderBottom: "1px solid var(--border2)", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1 }}>NEET 2027</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)" }}>Command Center</div>
        </div>
        <button onClick={() => onChangeTheme(themeMode === "dark" ? "light" : "dark")} style={{
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 10px", cursor: "pointer", fontSize: 15
        }}>{themeMode === "dark" ? "🌙" : "☀️"}</button>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 16px" }}>
        {tab === "home" && <DashboardPage taskStates={taskStates} studyHours={studyHours} missedRecords={missedRecords} today={today} examDate={examDate} ncertStates={ncertStates} revisionStates={revisionStates} pyqStates={pyqStates} />}
        {tab === "today" && <TodayPage taskStates={taskStates} onToggle={onToggle} onHours={onTaskHours} onOpenDetail={setSelectedTask} missedRecords={missedRecords} studyHours={studyHours} setSubjectHours={setSubjectHours} today={today} target={dailyTargetHours} examDate={examDate} ncertStates={ncertStates} revisionStates={revisionStates} pyqStates={pyqStates} spacedStates={spacedStates} onSpacedToggle={onSpacedToggle} isBufferDay={isBufferDay} assignments={assignments} onCompleteAssignment={onCompleteAssignment} mistakes={mistakes} onResolveMistake={onResolveMistake} />}
        {tab === "backlog" && <BacklogPage taskStates={taskStates} onToggle={onToggle} onHours={onTaskHours} onOpenDetail={setSelectedTask} today={today} />}

        {tab === "more" && moreTab === null && <MoreMenu onOpen={setMoreTab} />}
        {tab === "more" && moreTab === "physicsRef" && (<><SubPageHeader title="Physics Planner (Original)" onBack={() => setMoreTab(null)} /><PlannerReferencePage group="Physics" /></>)}
        {tab === "more" && moreTab === "chemistryRef" && (<><SubPageHeader title="Chemistry Planner (Original)" onBack={() => setMoreTab(null)} /><PlannerReferencePage group="Chemistry" /></>)}
        {tab === "more" && moreTab === "biologyRef" && (<><SubPageHeader title="Biology Planner (Original)" onBack={() => setMoreTab(null)} /><PlannerReferencePage group="Biology" /></>)}
        {tab === "more" && moreTab === "search" && (<><SubPageHeader title="Search & Filter" onBack={() => setMoreTab(null)} /><SearchPage taskStates={taskStates} missedRecords={missedRecords} onToggle={onToggle} onHours={onTaskHours} onOpenDetail={setSelectedTask} today={today} /></>)}
        {tab === "more" && moreTab === "assignments" && (<><SubPageHeader title="Assignments" onBack={() => setMoreTab(null)} /><AssignmentsPage assignments={assignments} today={today} onAdd={onAddAssignment} onComplete={onCompleteAssignment} onSkip={onSkipAssignment} onAddProof={onAddAssignmentProof} onRemoveProof={onRemoveAssignmentProof} onToggleRequireProof={onToggleAssignmentRequireProof} /></>)}
        {tab === "more" && moreTab === "dpp" && (<><SubPageHeader title="DPP Tracker" onBack={() => setMoreTab(null)} /><DppPage taskStates={taskStates} onToggle={onToggle} /></>)}
        {tab === "more" && moreTab === "ncert" && (<><SubPageHeader title="NCERT 8x Tracker" onBack={() => setMoreTab(null)} /><NcertPage ncertStates={ncertStates} onToggle={onNcertToggle} today={today} dueDateOverrides={dueDateOverrides} onReschedule={onRescheduleDue} /></>)}
        {tab === "more" && moreTab === "revision" && (<><SubPageHeader title="Revision 5x Tracker" onBack={() => setMoreTab(null)} /><RevisionPage revisionStates={revisionStates} onToggle={onRevisionToggle} today={today} dueDateOverrides={dueDateOverrides} onReschedule={onRescheduleDue} /></>)}
        {tab === "more" && moreTab === "pyq" && (<><SubPageHeader title="PYQ Tracker (1990-2026)" onBack={() => setMoreTab(null)} /><PyqPage pyqStates={pyqStates} onUpdate={onPyqUpdate} /></>)}
        {tab === "more" && moreTab === "mistakes" && (<><SubPageHeader title="Mistake Book" onBack={() => setMoreTab(null)} /><MistakeBookPage mistakes={mistakes} onAdd={onAddMistake} onResolve={onResolveMistake} onConvertToRevision={onConvertMistakeToRevision} today={today} /></>)}
        {tab === "more" && moreTab === "tests" && (<><SubPageHeader title="Test Analysis" onBack={() => setMoreTab(null)} /><TestAnalysisPage tests={tests} onAdd={onAddTest} /></>)}
        {tab === "more" && moreTab === "analytics" && (<><SubPageHeader title="Analytics" onBack={() => setMoreTab(null)} /><AnalyticsPage taskStates={taskStates} ncertStates={ncertStates} revisionStates={revisionStates} pyqStates={pyqStates} mistakes={mistakes} tests={tests} today={today} /></>)}
        {tab === "more" && moreTab === "heatmap" && (<><SubPageHeader title="Weak-Spot Heatmap" onBack={() => setMoreTab(null)} /><WeakSpotHeatmapPage mistakes={mistakes} pyqStates={pyqStates} /></>)}
        {tab === "more" && moreTab === "history" && (<><SubPageHeader title="History" onBack={() => setMoreTab(null)} /><HistoryPage history={history} /></>)}
        {tab === "more" && moreTab === "completedHistory" && (<><SubPageHeader title="Completed History" onBack={() => setMoreTab(null)} /><CompletedHistoryPage completedHistory={completedHistory} /></>)}
        {tab === "more" && moreTab === "integrity" && (<><SubPageHeader title="Data Integrity Check" onBack={() => setMoreTab(null)} /><IntegrityCheckPage taskStates={taskStates} missedRecords={missedRecords} /></>)}
        {tab === "more" && moreTab === "import" && (<><SubPageHeader title="Import Planner" onBack={() => setMoreTab(null)} /><PlannerImportPage importedPlanner={importedPlanner} onImport={onImportPlanner} /></>)}
        {tab === "more" && moreTab === "settings" && (<><SubPageHeader title="Settings" onBack={() => setMoreTab(null)} /><SettingsPage themeMode={themeMode} onChangeTheme={onChangeTheme} dailyTargetHours={dailyTargetHours} onChangeTarget={onChangeTarget} examDate={examDate} onChangeExamDate={onChangeExamDate} onExportData={onExportData} userEmail={userEmail} onLogout={onLogout} backlogSettings={backlogSettings} onApplyBacklogSettings={onApplyBacklogSettings} plannerLock={plannerLock} onChangePlannerLock={onChangePlannerLock} plannerVersions={plannerVersions} /></>)}
        {tab === "more" && moreTab === "telegram" && (<><SubPageHeader title="Telegram Sync" onBack={() => setMoreTab(null)} /><TelegramSyncPage taskStates={taskStates} onLinkTelegram={onLinkTelegram} telegramChannels={telegramChannels} onSaveChannel={onSaveTelegramChannel} /></>)}
      </div>

      <TaskDetailModal task={selectedTask} taskStates={taskStates} missedRecords={missedRecords} onClose={() => setSelectedTask(null)}
        onAddProof={onAddProof} onRemoveProof={onRemoveProof} onSetRequireProof={onSetRequireProof} onSetTaskNote={onSetTaskNote}
        onSkipTask={onSkipTask} onUnskipTask={onUnskipTask} />

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--nav-bg)", borderTop: "1px solid var(--border2)", display: "flex", justifyContent: "space-around", padding: "8px 4px calc(8px + env(safe-area-inset-bottom))", zIndex: 20 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon; const active = tab === item.key;
          return (
            <button key={item.key} onClick={() => { setTab(item.key); if (item.key !== "more") setMoreTab(null); }} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 10px", cursor: "pointer" }}>
              <Icon size={21} color={active ? "#3B82F6" : "var(--text-muted)"} />
              <span style={{ fontSize: 10, color: active ? "#3B82F6" : "var(--text-muted)", fontWeight: active ? 700 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
