import HomeClient from '@/components/HomeClient';
import { getAllQuestions } from '@/lib/questions';

export default function Home() {
  const questions = getAllQuestions();
  return <HomeClient questions={questions} />;
}
