import React, { useRef } from "react";
import { Text, useWindowDimensions } from "react-native";
import { s } from "./styles";
import { Place, PlaceProps } from "../place";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";

type Props = {
  data: PlaceProps[];
};

export function Places({ data }: Props) {
  const dimensions = useWindowDimensions();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = {
    min: 278,
    max: dimensions.height - 128,
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={[snapPoints.min, snapPoints.max]}
      handleIndicatorStyle={s.indicator}
      backgroundStyle={s.container}
      enableOverDrag={false}
    >
      <BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Place
            data={item}
            onPress={() => router.push({ pathname: '/market/[id]', params: { id: item.id } })} // Passando o parâmetro corretamente
          />
        )}
        ListHeaderComponent={() => <Text style={s.title}>Explore lugares perto de ti</Text>}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
}
