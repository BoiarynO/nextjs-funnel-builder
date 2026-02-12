import LinkButton from "@/components/ui/linkButton/LinkButton";
import Heading from "@/components/ui/heading/Heading";

export default function UiLinkButtonTest() {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <Heading as="h2">LinkButton</Heading>
      <div>
        <LinkButton href="/uitest" filled>
          LinkButton Filled
        </LinkButton>
      </div>
      <div>
        <LinkButton href="/uitest" outlined>
          LinkButton Outlined
        </LinkButton>
      </div>
    </section>
  );
}
