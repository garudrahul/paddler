import React, { useCallback, useState, type MouseEvent } from "react";

import { type Agent } from "../schemas/Agent";
import { ModelMetadataLoader } from "./ModelMetadataLoader";

import { modelMetadataPreviewButton } from "./ModelMetadataPreviewButton.module.css";

export function ModelMetadataPreviewButton({
  agent,
}: {
  agent: Agent;
}) {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const onClick = useCallback(
    function (evt: MouseEvent<HTMLButtonElement>) {
      evt.preventDefault();
      setIsDetailsVisible(true);
    },
    [],
  );

  const onClose = useCallback(function () {
    setIsDetailsVisible(false);
  }, []);

  return (
    <>
      <button className={modelMetadataPreviewButton} onClick={onClick}>
        Metadata
      </button>
      {isDetailsVisible && (
        <ModelMetadataLoader agent={agent} onClose={onClose} />
      )}
    </>
  );
}
