import { decoratedLinkVariant, linkVariant } from ".";

const meta = {
  title: "Components/Href",
};
export default meta;

export const Context = () => (
  <>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived.{" "}
      <a className={linkVariant} href="#">
        Visit the Lonlat website
      </a>
      , not only five centuries, but also the leap into electronic typesetting, remaining
      essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
      containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
      PageMaker including versions of Lorem Ipsum.
    </p>
    <h2>Href versus Button</h2>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived.{" "}
      <a className={decoratedLinkVariant} href="#">
        href component
      </a>
      , not only five centuries, but also the leap into electronic typesetting, remaining
      essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
      containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
      PageMaker including versions of Lorem Ipsum.
    </p>
    <h2>With ghost</h2>
    <p>
      There is a <a href="#">ghost</a> link.
    </p>
  </>
);
