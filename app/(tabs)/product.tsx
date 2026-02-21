import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  images: string[];
};

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 10;

  const fetchProducts = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await axios.get(
        `https://api.freeapi.app/api/v1/public/randomproducts?page=${pageNumber}&limit=${LIMIT}&inc=category,price,thumbnail,images,title,id&query=mens-watches`,
      );

      const responseData = res.data?.data;

      setTotalPages(responseData.totalPages);

      if (pageNumber === 1) {
        setProducts(responseData.data);
      } else {
        setProducts((prev) => [...prev, ...responseData.data]);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  category: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
  },
});
