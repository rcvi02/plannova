import {
  Calculator, Atom, FlaskConical, Microscope, BookOpen, Code, Globe,
  Palette, Landmark, BarChart3, Dna, Music, Sun, Book, FileText,
  Activity, Droplets, Wind, Target, Apple, Moon, PenTool, Lock,
  AlertTriangle, Database, Brain, Star, CheckCircle2, TrendingUp,
  Sparkles, Zap, Clock, Flame, GraduationCap, Check, Plus, Play,
  AlertCircle, Shield, Bell, User
} from 'lucide-react'

const ICON_MAP = {
  Calculator, Atom, FlaskConical, Microscope, BookOpen, Code, Globe,
  Palette, Landmark, BarChart: BarChart3, BarChart3, Dna, Music, Sun,
  Book, FileText, Activity, Droplets, Wind, Target, Apple, Moon,
  PenTool, Lock, AlertTriangle, Database, Brain, Star, CheckCircle2,
  TrendingUp, Sparkles, Zap, Clock, Flame, GraduationCap, Check, Plus,
  Play, AlertCircle, Shield, Bell, User
}

export default function IconRenderer({ name, size = 16, className, style }) {
  const IconComponent = (name && ICON_MAP[name]) || BookOpen
  return <IconComponent size={size} className={className} style={style} />
}
