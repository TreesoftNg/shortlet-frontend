import { PropertyPage } from '@/features/property';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <PropertyPage slug={slug} />;
}
