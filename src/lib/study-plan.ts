import fs from 'fs';
import path from 'path';

const PLAN_FILE = path.join(process.cwd(), 'study-plan', 'top-100-liked.json');

export interface StudyPlanGroup {
  name: string;
  lcIds: number[];
}
export interface StudyPlan {
  slug: string;
  title: string;
  subtitle: string;
  groups: StudyPlanGroup[];
}

let _cache: StudyPlan | null = null;

export function getTop100Plan(): StudyPlan {
  if (_cache) return _cache;
  const raw = fs.readFileSync(PLAN_FILE, 'utf-8');
  const parsed: StudyPlan = JSON.parse(raw);
  _cache = parsed;
  return parsed;
}
