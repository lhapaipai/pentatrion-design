import { decoratedLinkVariant, linkVariant, linkBg, proseLinkVariant } from ".";

const meta = {
  title: "Components/Href",
};
export default meta;

export const Context = () => (
  <>
    <ul>
      <li></li>
    </ul>
    <dl className="mb-8 grid grid-cols-[200px_1fr]">
      <dt>linkVariant</dt>
      <dd>
        <a className={linkVariant} href="#">
          website
        </a>
      </dd>

      <dt>decoratedLinkVariant</dt>
      <dd>
        <a className={decoratedLinkVariant} href="#">
          website
        </a>
      </dd>

      <dt>linkBg</dt>
      <dd>
        <a className={linkBg} href="#">
          website
        </a>
      </dd>

      <dt>proseLinkVariant</dt>
      <dd>
        <a className={proseLinkVariant} href="#">
          website
        </a>
      </dd>
    </dl>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived.{" "}
      <a className={linkVariant} href="#">
        Visit the Lonlat website
      </a>
      , not only five centuries, but also the leap into electronic typesetting, remaining
      essentially{" "}
      <a className={linkBg} href="#">
        unchanged
      </a>
      . It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
      passages, and more recently with desktop publishing software like Aldus PageMaker including
      versions of Lorem Ipsum.
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
      essentially unchanged. It was{" "}
      <a className={proseLinkVariant} href="#">
        popularised
      </a>{" "}
      in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
      recently with desktop publishing software like Aldus PageMaker including versions of Lorem
      Ipsum.
    </p>
    <h2>With ghost</h2>
    <p>
      There is a <a href="#">ghost</a> link.
    </p>
  </>
);
