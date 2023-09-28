import { useState, useEffect, useRef } from 'react';
import { useTailorContext } from './';

import styles from '@styles/components/utils/Tailor/Nodes.module.scss';

const Nodes = ({ as, nodeComponent, ...props }) => {
  const { onCompleted, tailorLimitedHeight, tailorHeight,
          nodesData, nodesDataArray, setNodesDataArray,
          setRagNodesDataArray } = useTailorContext(),
        [tailoring, setTailoring] = useState(true),
        selfRef = useRef(),
        tmpNodeComponentsRef = useRef(),
        As = as || 'div',
        Component = nodeComponent;

  useEffect(() => {
    if (!tmpNodeComponentsRef.current) return;

    moveInvalidNodesToRagNodesDataArray()
  }, [tmpNodeComponentsRef.current])

  useEffect(() => {
    if (nodesDataArray.length === 0) return

    setTailoring(false)
  }, [nodesDataArray])

  useEffect(() => {
    if (nodesDataArray.length === 0) return

    if (typeof onCompleted === 'function') setTimeout(onCompleted, 50)
  }, [nodesDataArray])

  function outerHeight(element) {
    const height = element.offsetHeight,
          style = window.getComputedStyle(element)

    return ['top', 'bottom']
      .map(side => parseInt(style[`margin-${side}`]))
      .reduce((total, side) => total + side, height)
  }

  function moveInvalidNodesToRagNodesDataArray() {
    let tailorHeightSum = tailorHeight;
    const dataArray = [],
          ragDataArray = [];
    tmpNodeComponentsRef.current.childNodes.forEach((node, index) => {
      if ((tailorHeightSum + node.offsetHeight) <= tailorLimitedHeight) {
        dataArray.push(nodesData[index]);
        tailorHeightSum += outerHeight(node);
      } else {
        ragDataArray.push(nodesData[index]);
      }
    });
    setNodesDataArray(dataArray);
    setRagNodesDataArray(ragDataArray);
  }

  return (
    <>
      { nodesDataArray.length > 0 &&
        <As {...props} ref={selfRef}>
          { nodesDataArray.map((nodeData, index) => (
            <Component key={index} nodeData={nodeData} />
            )) }
        </As> }

      { tailoring &&
        <As
          {...props}
          className={`${props.className} ${styles.temporary} position-absolute`}
          ref={tmpNodeComponentsRef}
        >
          { nodesData.map((nodeData, index) => (
            <Component key={index} nodeData={nodeData} />
          )) }
        </As> }
    </>
  );
};

export default Nodes;
