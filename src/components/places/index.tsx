import React, { useRef } from "react";
import { Text, useWindowDimensions } from "react-native";
import { s } from "./styles";
import { Place, PlaceProps } from "../place";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

type Props = {
  data: PlaceProps[];
};

export function Places({ data }: Props) {
  const dimensions = useWindowDimensions();
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0} 
      snapPoints={[dimensions.height * 0.5, dimensions.height * 0.75, "100%"]} 
    >
      <BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => <Place data={item} />}
      />
    </BottomSheet>
  );
}
