import type { Meta } from "@storybook/react-vite";

import { Accordion } from "./Accordion";
import { AccordionTrigger } from "./AccordionTrigger";
import { AccordionContent } from "./AccordionContent";
import { useState } from "react";
import { Button } from "../button";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;

export const Context = () => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <div className="mb-2">
        <Button onClick={() => setShow((s) => !s)}>Afficher</Button>
      </div>
      {show && (
        <Accordion defaultValue="config">
          <AccordionTrigger name="config">Configuration</AccordionTrigger>
          <AccordionContent name="config">
            {Array.from({ length: 5 }).map((_, i) => (
              <p key={i}>
                Configuration: Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
                accusamus ut, voluptates illum tempore, quod velit debitis ea blanditiis magni omnis
                placeat beatae porro. Sit optio quia nihil excepturi exercitationem?
              </p>
            ))}
          </AccordionContent>
          <AccordionTrigger name="display">Affichage</AccordionTrigger>
          <AccordionContent name="display">
            {Array.from({ length: 5 }).map((_, i) => (
              <p key={i}>
                Affichage: Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
                accusamus ut, voluptates illum tempore, quod velit debitis ea blanditiis magni omnis
                placeat beatae porro. Sit optio quia nihil excepturi exercitationem?
              </p>
            ))}
          </AccordionContent>
        </Accordion>
      )}
    </div>
  );
};
