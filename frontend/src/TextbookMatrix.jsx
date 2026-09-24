import React from "react";

// Textbook Matrix Component rendering authentic mathematical square bracket matrices
export function TextbookMatrix({ matrix, scalar }) {
  const is2x1 =
    matrix.length === 2 &&
    (!Array.isArray(matrix[0]) || matrix[0].length === 1);

  return (
    <span className="textbook-matrix-wrapper">
      {scalar && <span className="matrix-scalar">{scalar}</span>}
      <span className="textbook-matrix">
        {is2x1 ? (
          <span className="matrix-col-2x1">
            <span>{Array.isArray(matrix[0]) ? matrix[0][0] : matrix[0]}</span>
            <span>{Array.isArray(matrix[1]) ? matrix[1][0] : matrix[1]}</span>
          </span>
        ) : (
          <span className="matrix-grid-2x2">
            <span>{matrix[0][0]}</span>
            <span>{matrix[0][1]}</span>
            <span>{matrix[1][0]}</span>
            <span>{matrix[1][1]}</span>
          </span>
        )}
      </span>
    </span>
  );
}

export default TextbookMatrix;
