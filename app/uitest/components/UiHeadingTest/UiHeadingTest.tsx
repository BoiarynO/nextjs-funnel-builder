import Heading from "@/components/ui/heading/Heading";

export default function UiHeadingTest() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Heading as="h2">Heading</Heading>
      <Heading as="h1">Heading 1</Heading>
      <Heading as="h2">Heading 2</Heading>
      <Heading as="h3">Heading 3</Heading>
      <Heading as="h4">Heading 4</Heading>
    </section>
  );
}
