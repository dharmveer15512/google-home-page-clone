import React, { useMemo, useRef } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const SearchBottomSheet = ({ image }: { image: string }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["30%", "60%"], []);

  const SearchResult = Array.from({ length: 11 }, (_, index) => {
    return {
      id: index,
      title: `Buy Product from ${index % 2 === 0 ? "Amazon.com" : "Myntra"}`,
      image: image,
      price: `₹${Math.floor(Math.random() * 1000) + 500}`,
      platform: index % 2 === 0 ? "Amazon.com" : "Myntra",
      platformIcon: index % 2 === 0 ? "🅰️" : "Ⓜ️",
      small: index % 2 === 0 ? false : true,
    };
  });

  const ProductCard = ({ item, isSmall }: { item: any; isSmall: boolean }) => {
    return (
      <View key={item.id} style={[styles.searchResult]}>
        <Image
          source={{ uri: item.image }}
          style={[styles.image, isSmall ? styles.smallImage : styles.bigImage]}
          resizeMode="cover"
        />
        <View style={styles.platformContainer}>
          <Text>{item.platformIcon}</Text>
          <Text style={styles.platformText}>{item.platform}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
    );
  };

  return (
    <BottomSheet snapPoints={snapPoints} ref={bottomSheetRef}>
      <BottomSheetScrollView
        contentContainerStyle={{
          flexDirection: "row",
          paddingBottom: 100,
          padding: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          {SearchResult.filter((item) => item.small).map((item) => (
            <ProductCard key={item.id} item={item} isSmall={false} />
          ))}
        </View>
        <View style={{ flex: 1 }}>
          {SearchResult.filter((item) => !item.small).map((item) => (
            <ProductCard key={item.id} item={item} isSmall={true} />
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
  },
  searchResult: {
    margin: 5,
    borderRadius: 10,
    // overflow: "hidden",
    backgroundColor: "white",
    width: "100%",
  },
  platformContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  platformText: {
    fontSize: 12,
    color: "#666",
  },
  productInfo: {
    paddingVertical: 8,
  },
  image: {
    width: "90%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  bigImage: {
    height: 300,
  },
  smallImage: {
    height: 200,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  flatListContent: {
    padding: 10,
    paddingBottom: 100,
    gap: 10,
  },
});

export default SearchBottomSheet;
