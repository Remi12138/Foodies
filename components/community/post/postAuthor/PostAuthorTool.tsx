import { ThemedView } from "@/components/ThemedView";
import PostBtnDeletion from "@/components/community/post/postDeletion/postBtnDeletion";
import PostBtnModify from "@/components/community/post/postUpdate/PostBtnModify";
import { StyleSheet, View } from "react-native";

function PostAuthorTool({ blogId }: { blogId: string }) {
  return (
    <ThemedView style={styles.row}>
      <View style={styles.buttonStartContainer}>
        <PostBtnModify blogId={blogId} />
      </View>
      <View style={styles.buttonEndContainer}>
        <PostBtnDeletion blogId={blogId} />
      </View>
    </ThemedView>
  );
}

export default PostAuthorTool;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStartContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginStart: 0,
  },
  buttonEndContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginEnd: 0,
  },
});
