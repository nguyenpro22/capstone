"use client";

import { useState, useCallback } from "react";

export function useArrayState<T>(initialState: T[] = []) {
  const [array, setArray] = useState<T[]>(initialState);

  const push = useCallback((item: T) => {
    setArray((prevArray) => [...prevArray, item]);
  }, []);

  const update = useCallback((index: number, item: T) => {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = item;
      return newArray;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 1);
      return newArray;
    });
  }, []);

  const filter = useCallback(
    (callback: (value: T, index: number, array: T[]) => boolean) => {
      setArray((prevArray) => prevArray.filter(callback));
    },
    []
  );

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const map = useCallback(
    (callback: (value: T, index: number, array: T[]) => T) => {
      setArray((prevArray) => prevArray.map(callback));
    },
    []
  );

  const sort = useCallback((compareFunction?: (a: T, b: T) => number) => {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      return newArray.sort(compareFunction);
    });
  }, []);

  return {
    array,
    setArray,
    push,
    update,
    remove,
    filter,
    clear,
    map,
    sort,
  };
}
