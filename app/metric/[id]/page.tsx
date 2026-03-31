import { MetricDetailPage } from "../../../src/app/pages/MetricDetailPage";
import { HealthcarePage } from "../../../src/app/pages/HealthcarePage";
import { AgriculturePage } from "../../../src/app/pages/AgriculturePage";
import { MsmeEconomyPage } from "../../../src/app/pages/MsmeEconomyPage";
import { DigitalSuperhighwayCreativeEconomyPage } from "../../../src/app/pages/DigitalSuperhighwayCreativeEconomyPage";

interface MetricPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: MetricPageProps) {
  const { id } = await params;
  if (id === "healthcare") {
    return <HealthcarePage />;
  }
  if (id === "agriculture") {
    return <AgriculturePage />;
  }
  if (id === "msme" || id === "msme-economy") {
    return <MsmeEconomyPage />;
  }
  if (id === "digital-superhighway-creative-economy" || id === "digital-superhighway") {
    return <DigitalSuperhighwayCreativeEconomyPage />;
  }
  return <MetricDetailPage id={id} />;
}
