import { memo, useId } from "react";
import { OptionLike } from "../select";
import { useListItem } from "@floating-ui/react";
import { useAutocomplete } from "./useAutocompleteContext";
import clsx from "clsx";
import { getOptionLabel, getOptionValue } from "./util";

export type AutocompleteOptionProps<O extends OptionLike> = O;

export const AutocompleteOption = memo(function AutocompleteOption<O extends OptionLike>(
  props: AutocompleteOptionProps<O>,
) {
  const label = getOptionLabel(props);

  const id = useId();
  const { activeIndex, selection, getItemProps, handleSelect } = useAutocomplete();
  const { ref, index } = useListItem({ label });
  const isActive = activeIndex === index;
  const isSelected = selection ? getOptionValue(selection) === getOptionValue(props) : false;

  return (
    <div
      className={clsx("option", isSelected ? "bg-gray-2" : isActive && "bg-gray-1")}
      ref={ref}
      role="option"
      id={id}
      data-presentation="compact"
      aria-selected={isActive}
      {...getItemProps({
        onClick: () => handleSelect(index),
      })}
    >
      {label}
    </div>
  );
});
