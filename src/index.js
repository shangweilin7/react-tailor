import { useState, useEffect, useRef, useContext, createContext } from 'react';

import Header from './Header';
import Body from './Body';
import Nodes from './Nodes';
import Footer from './Footer';

const TailorContext = createContext();
export const useTailorContext = () => useContext(TailorContext);

const Tailor = (props) => {
  const selfRef = useRef(null),
        { width, height, nodesData, onCompleted, children, ...childProps } = props,
        [tailorCompleted, setTailorCompleted] = useState(false),
        [currentHeight, setCurrentHeight] = useState(null),
        [tailorLimitedHeight, setTailorLimitedHeight] = useState(null),
        [nodesDataArray, setNodesDataArray]  = useState([]),
        [ragNodesDataArray, setRagNodesDataArray] = useState([]),
        headers = children.filter((obj) => obj.type === Header),
        regularHeaders = children.filter((obj) => obj.type === Header && obj.props.regular !== 'false'),
        body = children.find((obj) => obj.type === Body),
        footers = children.filter((obj) => obj.type === Footer),
        regularFooters = children.filter((obj) => obj.type === Footer && obj.props.regular !== 'false');

  useEffect(() => {
    if (!selfRef.current) return;

    const computedStyle = window.getComputedStyle(selfRef.current);
    setTailorLimitedHeight(
      height - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom)
    );
  }, [selfRef.current]);

  useEffect(() => {
    setCurrentHeight(selfRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    if (typeof onCompleted !== 'function' || !tailorCompleted) return;

    onCompleted();
  }, [tailorCompleted]);

  return (
    <TailorContext.Provider
      value={{
        onCompleted, tailorLimitedHeight, tailorHeight: currentHeight,
        nodesData, nodesDataArray, setNodesDataArray, ragNodesDataArray, setRagNodesDataArray
      }}
    >
      <div
        { ...childProps }
        className="tailor overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div
          className={childProps.className}
          ref={selfRef}
        >
          {headers}
          {body}
          {ragNodesDataArray.length > 0 ? regularFooters : footers}
        </div>
      </div>
      { ragNodesDataArray.length > 0 &&
        <Tailor
          { ...props }
          nodesData={ragNodesDataArray}
          onCompleted={() => setTailorCompleted(true)}
        >
          {[...regularHeaders, body, ...footers]}
        </Tailor> }
    </TailorContext.Provider>
  );
};

Tailor.displayName = 'Tailor';

module.exports = Object.assign(Tailor, { Header, Body, Nodes, Footer });
