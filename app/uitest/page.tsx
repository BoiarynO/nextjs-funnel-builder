import UiTestWrapper from "./components/UiTestWrapper/UiTestWrapper";
import UiColorSchema from "./components/UiColorSchema/UiColorSchema";
import UiButtonTest from "./components/UiButtonTest/UiButtonTest";

export default function UiTestPage() {
  return (
    <UiTestWrapper>
      <UiColorSchema />
      <UiButtonTest />
    </UiTestWrapper>
  );
}
