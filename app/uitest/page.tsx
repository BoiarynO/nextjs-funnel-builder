import UiTestWrapper from "./components/UiTestWrapper/UiTestWrapper";
import UiColorSchema from "./components/UiColorSchema/UiColorSchema";
import UiButtonTest from "./components/UiButtonTest/UiButtonTest";
import UiHeadingTest from "./components/UiHeadingTest/UiHeadingTest";
import UiLinkButtonTest from "./components/UiLinkButtonTest/UiLinkButtonTest";
import UiRadioButtonTest from "./components/UiRadioButtonTest/UiRadioButtonTest";
import UiInputTest from "./components/UiInputTest/UiInputTest";
import UiDropdownTest from "./components/UiDropdownTest/UiDropdownTest";
import UiReorderListTest from "./components/UiReorderListTest/UiReorderListTest";

export default function UiTestPage() {
  return (
    <UiTestWrapper>
      <UiColorSchema />
      <UiButtonTest />
      <UiHeadingTest />
      <UiLinkButtonTest />
      <UiRadioButtonTest />
      <UiInputTest />
      <UiDropdownTest />
      <UiReorderListTest />
    </UiTestWrapper>
  );
}
