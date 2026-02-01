type AnalyticsParams = Record<string, string | number | boolean | undefined>;

const MAX_LABEL_LENGTH = 120;

const normalizeLabel = (value?: string | null) => {
  if (!value) return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, MAX_LABEL_LENGTH) : undefined;
};

const normalizeValue = (value?: string | null) => {
  if (!value) return undefined;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, MAX_LABEL_LENGTH) : undefined;
};

const getPagePath = () => (typeof window !== "undefined" ? window.location.pathname : undefined);

const getGtag = () =>
  typeof window !== "undefined"
    ? (window as Window & { gtag?: (...args: any[]) => void }).gtag
    : undefined;

const isAnalyticsAvailable = () => typeof getGtag() === "function";

export const trackUiEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (!isAnalyticsAvailable()) return;
  getGtag()?.("event", eventName, {
    page_path: params.page_path ?? getPagePath(),
    ...params,
  });
};

const baseParamsForElement = (element: HTMLElement): AnalyticsParams => ({
  element_id: element.id || undefined,
  element_name: element.getAttribute("name") || undefined,
  element_role: element.getAttribute("role") || undefined,
});

const getAnalyticsEvent = (element: HTMLElement, fallback: string) =>
  element.getAttribute("data-analytics-event") || fallback;

const getAnalyticsLabel = (element: HTMLElement, fallback?: string | null) =>
  element.getAttribute("data-analytics-label") || fallback || undefined;

const getButtonLabel = (button: HTMLButtonElement) =>
  normalizeLabel(
    button.getAttribute("data-analytics-label") ||
      button.getAttribute("aria-label") ||
      button.getAttribute("title") ||
      button.getAttribute("name") ||
      button.textContent,
  );

const getInputLabel = (input: HTMLInputElement) =>
  normalizeLabel(
    input.getAttribute("data-analytics-label") ||
      input.getAttribute("aria-label") ||
      input.getAttribute("placeholder") ||
      input.getAttribute("name") ||
      input.getAttribute("id"),
  );

export const trackButtonClick = (button: HTMLButtonElement) => {
  const eventName = getAnalyticsEvent(button, "ui_button_click");
  const label = getAnalyticsLabel(button, getButtonLabel(button));

  trackUiEvent(eventName, {
    ...baseParamsForElement(button),
    element_label: label ?? "unlabeled",
    element_type: button.type || "button",
  });
};

export const trackInputChange = (input: HTMLInputElement) => {
  const eventName = getAnalyticsEvent(input, "ui_input_change");
  const label = getAnalyticsLabel(input, getInputLabel(input));
  const includeValue = input.getAttribute("data-analytics-include-value") === "true";

  trackUiEvent(eventName, {
    ...baseParamsForElement(input),
    element_label: label ?? "unlabeled",
    element_type: input.type || "text",
    element_value: includeValue ? normalizeValue(input.value) : undefined,
  });
};
