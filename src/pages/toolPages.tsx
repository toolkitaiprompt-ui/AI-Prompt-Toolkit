import { lazy, Suspense, type ComponentType } from "react";
import ToolContainer from "../components/ToolContainer";
import { ToolSkeleton } from "../components/ToolSkeleton";
import type { ToolMeta } from "../data/tools";

function makeToolPage(loader: () => Promise<{ default: ComponentType }>) {
  const Body = lazy(loader);
  return function ToolPage(props: {
    title: string;
    description: string;
    toolSlug: string;
    tool: ToolMeta;
  }) {
    return (
      <ToolContainer {...props}>
        <Suspense fallback={<ToolSkeleton />}>
          <Body />
        </Suspense>
      </ToolContainer>
    );
  };
}

export const PromptOptimizerPage = makeToolPage(() => import("../components/PromptOptimizer"));
export const PromptConverterPage = makeToolPage(() => import("../components/PromptConverter"));
export const PersonaBuilderPage = makeToolPage(() => import("../components/PersonaBuilder"));
export const PromptComparisonPage = makeToolPage(() => import("../components/PromptComparison"));
export const MegaPromptBuilderPage = makeToolPage(() => import("../components/MegaPromptBuilder"));
export const PromptDebuggerPage = makeToolPage(() => import("../components/PromptDebugger"));
export const SecurityScannerPage = makeToolPage(() => import("../components/SecurityScanner"));
export const PromptChainBuilderPage = makeToolPage(() => import("../components/PromptChainBuilder"));
export const PromptTranslatorPage = makeToolPage(() => import("../components/PromptTranslator"));
export const ApiRequestBuilderPage = makeToolPage(() => import("../components/ApiRequestBuilder"));
export const ImagePromptGeneratorPage = makeToolPage(() => import("../components/demo/ImagePromptGenerator"));
export const ContentSummarizerPage = makeToolPage(() => import("../components/demo/ContentSummarizer"));
export const RegexGeneratorPage = makeToolPage(() => import("../components/demo/RegexGenerator"));
