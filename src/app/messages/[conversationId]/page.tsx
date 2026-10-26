import { ConversationPage } from '@/features/messages';

type PageProps = {
  params: Promise<{ conversationId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { conversationId } = await params;
  return <ConversationPage conversationId={conversationId} />;
}
