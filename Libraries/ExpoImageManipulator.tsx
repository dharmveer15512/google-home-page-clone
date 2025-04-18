// @ts-nocheck
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Modal,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  YellowBox,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  LogBox,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import PropTypes from "prop-types";
import AutoHeightImage from "react-native-auto-height-image";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ifIphoneX,
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace,
} from "react-native-iphone-x-helper";
import ImageCropOverlay from "./ImageCropOverlay";

const { width, height } = Dimensions.get("window");


LogBox.ignoreAllLogs();

interface ExpoImageManipulatorProps {
  photo: { uri: string };
  isVisible: boolean;
  onPictureChoosed: (data: { uri: string; base64: string }) => void;
  onToggleModal: () => void;
  squareAspect: boolean;
  btnTexts: {
    crop: string;
    rotate: string;
    done: string;
    processing: string;
  };
  dragVelocity: number;
  resizeVelocity: number;
  saveOptions: {
    compress: number;
    format: string;
    base64: boolean;
  };
  onClose: () => void;
  inset: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  SearchBottomSheet: React.ReactNode;
}

class ExpoImageManipulator extends Component<ExpoImageManipulatorProps, any> {
  constructor(props: ExpoImageManipulatorProps) {
    super(props);
    const { squareAspect } = this.props;
    this.state = {
      cropMode: true,
      processing: false,
      zoomScale: 1,
      squareAspect,
    };

    this.scrollOffset = 0;

    this.currentPos = {
      left: 0,
      top: 0,
    };

    this.currentSize = {
      width: 0,
      height: 0,
    };

    this.maxSizes = {
      width: 0,
      height: 0,
    };

    this.actualSize = {
      width: 0,
      height: 0,
    };
  }

  async componentDidMount() {
    await this.onConvertImageToEditableSize();
  }

  async onConvertImageToEditableSize() {
    const {
      photo: { uri: rawUri },
    } = this.props;
    const { uri, width, height } = await ImageManipulator.manipulateAsync(
      rawUri,
      [
        {
          resize: {
            width: 1080,
          },
        },
      ]
    );
    this.setState({
      uri,
    });
    this.actualSize.width = width;
    this.actualSize.height = height;
  }

  get isRemote() {
    const { uri } = this.state;
    return /^(http|https|ftp)?(?:[:/]*)([a-z0-9.-]*)(?::([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/.test(
      uri
    );
  }

  onToggleModal = () => {
    const { onToggleModal } = this.props;
    onToggleModal();
    this.setState({ cropMode: false });
  };

  onCropImage = () => {
    this.setState({ processing: true });
    const { uri } = this.state;
    Image.getSize(uri, async (actualWidth, actualHeight) => {
      let cropObj = this.getCropBounds(actualWidth, actualHeight);
      if (cropObj.height > 0 && cropObj.width > 0) {
        let uriToCrop = uri;
        if (this.isRemote) {
          const response = await FileSystem.downloadAsync(
            uri,
            FileSystem.documentDirectory + "image"
          );
          uriToCrop = response.uri;
        }
        const {
          uri: uriCroped,
          base64,
          width: croppedWidth,
          height: croppedHeight,
        } = await this.crop(cropObj, uriToCrop);

        this.actualSize.width = croppedWidth;
        this.actualSize.height = croppedHeight;

        this.setState({
          uri: uriCroped,
          base64,
          cropMode: true,
          processing: false,
        });
        this.props.onPictureChoosed({ uri: uriCroped, base64 });
      } else {
        this.setState({ cropMode: true, processing: false });
      }
    });
  };

  onRotateImage = async () => {
    const { uri } = this.state;
    let uriToCrop = uri;
    if (this.isRemote) {
      const response = await FileSystem.downloadAsync(
        uri,
        FileSystem.documentDirectory + "image"
      );
      uriToCrop = response.uri;
    }
    Image.getSize(uri, async (width2, height2) => {
      const { uri: rotUri, base64 } = await this.rotate(
        uriToCrop,
        width2,
        height2
      );
      this.setState({ uri: rotUri, base64 });
    });
  };

  onFlipImage = async (orientation: any) => {
    const { uri } = this.state;
    let uriToCrop = uri;
    if (this.isRemote) {
      const response = await FileSystem.downloadAsync(
        uri,
        FileSystem.documentDirectory + "image"
      );
      uriToCrop = response.uri;
    }
    Image.getSize(uri, async (width2, height2) => {
      const { uri: rotUri, base64 } = await this.filp(uriToCrop, orientation);
      this.setState({ uri: rotUri, base64 });
    });
  };

  onHandleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.scrollOffset = event.nativeEvent.contentOffset.y;
  };

  getCropBounds = (actualWidth: number, actualHeight: number) => {
    let imageRatio = actualHeight / actualWidth;
    var originalHeight = Dimensions.get("window").height - 64;
    if (isIphoneX()) {
      originalHeight = Dimensions.get("window").height - 122;
    }
    let renderedImageWidth =
      imageRatio < originalHeight / width ? width : originalHeight / imageRatio;
    let renderedImageHeight =
      imageRatio < originalHeight / width ? width * imageRatio : originalHeight;

    let renderedImageY = (originalHeight - renderedImageHeight) / 2.0;
    let renderedImageX = (width - renderedImageWidth) / 2.0;

    const renderImageObj = {
      left: renderedImageX,
      top: renderedImageY,
      width: renderedImageWidth,
      height: renderedImageHeight,
    };
    const cropOverlayObj = {
      left: this.currentPos.left,
      top: this.currentPos.top,
      width: this.currentSize.width,
      height: this.currentSize.height,
    };

    var intersectAreaObj = {};

    let x = Math.max(renderImageObj.left, cropOverlayObj.left);
    let num1 = Math.min(
      renderImageObj.left + renderImageObj.width,
      cropOverlayObj.left + cropOverlayObj.width
    );
    let y = Math.max(renderImageObj.top, cropOverlayObj.top);
    let num2 = Math.min(
      renderImageObj.top + renderImageObj.height,
      cropOverlayObj.top + cropOverlayObj.height
    );
    if (num1 >= x && num2 >= y)
      intersectAreaObj = {
        originX: (x - renderedImageX) * (actualWidth / renderedImageWidth),
        originY: (y - renderedImageY) * (actualWidth / renderedImageWidth),
        width: (num1 - x) * (actualWidth / renderedImageWidth),
        height: (num2 - y) * (actualWidth / renderedImageWidth),
      };
    else {
      intersectAreaObj = {
        originX: x - renderedImageX,
        originY: y - renderedImageY,
        width: 0,
        height: 0,
      };
    }
    return intersectAreaObj;
  };

  filp = async (uri: string, orientation: string) => {
    const { saveOptions } = this.props;
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          flip:
            orientation == "vertical"
              ? ImageManipulator.FlipType.Vertical
              : ImageManipulator.FlipType.Horizontal,
        },
      ],
      saveOptions
    );
    return manipResult;
  };

  rotate = async (uri: string, width2: number, height2: number) => {
    const { saveOptions } = this.props;
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          rotate: -90,
        },
        {
          resize: {
            width: this.trueWidth || width2,
            // height: this.trueHeight || height2,
          },
        },
      ],
      saveOptions
    );
    return manipResult;
  };

  crop = async (cropObj, uri) => {
    const { saveOptions } = this.props;
    if (cropObj.height > 0 && cropObj.width > 0) {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: cropObj,
          },
        ],
        saveOptions
      );
      return manipResult;
    }
    return {
      uri: null,
      base64: null,
    };
  };

  calculateMaxSizes = (event: NativeSyntheticEvent<LayoutChangeEvent>) => {
    let w1 = event.nativeEvent.layout.width || 100;
    let h1 = event.nativeEvent.layout.height || 100;
    if (this.state.squareAspect) {
      if (w1 < h1) h1 = w1;
      else w1 = h1;
    }
    this.maxSizes.width = w1;
    this.maxSizes.height = h1;
  };

  // eslint-disable-next-line camelcase
  async UNSAFE_componentWillReceiveProps() {
    await this.onConvertImageToEditableSize();
  }

  zoomImage() {
    // this.refs.imageScrollView.zoomScale = 5
    // this.setState({width: width})
    // this.setState({zoomScale: 5})
    // this.setState(curHeight)
  }

  render() {
    const { uri, base64, cropMode, processing, zoomScale } = this.state;

    let imageRatio = this.actualSize.height / this.actualSize.width;
    var originalHeight = Dimensions.get("window").height - 64;
    if (isIphoneX()) {
      originalHeight = Dimensions.get("window").height - 122;
    }

    let cropRatio = originalHeight / width;

    let cropWidth =
      imageRatio < cropRatio ? width : originalHeight / imageRatio;
    let cropHeight =
      imageRatio < cropRatio ? width * imageRatio : originalHeight;

    let cropInitialTop = (originalHeight - cropHeight) / 2.0;
    let cropInitialLeft = (width - cropWidth) / 2.0;

    if (this.currentSize.width == 0 && cropMode) {
      this.currentSize.width = cropWidth;
      this.currentSize.height = cropHeight;

      this.currentPos.top = cropInitialTop;
      this.currentPos.left = cropInitialLeft;
    }
    if (uri == undefined) {
      return <View></View>;
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          <SafeAreaView
            style={{
              width,
              flexDirection: "row",
              backgroundColor: "#fff",
              justifyContent: "space-between",
            }}
          >
            <ScrollView
              scrollEnabled={false}
              horizontal
              contentContainerStyle={{
                width: "100%",
                paddingHorizontal: 15,
                height: 44,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => this.props.onClose()}
                  style={{
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} name={"arrow-left"} color="#000" />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.onCropImage()}
                    style={{
                      marginRight: 10,
                      width: 60,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        color: "#000",
                        fontSize: 18,
                      }}
                    >
                      {processing ? "Processing" : "CROP"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              width: Dimensions.get("window").width,
            }}
          >
            <ScrollView
              ref={"imageScrollView"}
              style={{ position: "relative", flex: 1, marginBottom: 100 }}
              contentContainerStyle={{ backgroundColor: "black" }}
              maximumZoomScale={5}
              minimumZoomScale={0.5}
              onScroll={this.onHandleScroll}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ref={(c) => {
                this.scrollView = c;
              }}
              scrollEventThrottle={16}
              scrollEnabled={false}
              pinchGestureEnabled={false}
              // scrollEnabled={cropMode ? false : true}
              // pinchGestureEnabled={cropMode ? false : pinchGestureEnabled}
            >
              <AutoHeightImage
                style={{ backgroundColor: "black" }}
                source={{ uri }}
                resizeMode={imageRatio >= 1 ? "contain" : "contain"}
                width={width}
                height={originalHeight}
                onLayout={this.calculateMaxSizes}
              />
              {!!cropMode && (
                <ImageCropOverlay
                  onLayoutChanged={(
                    top: number,
                    left: number,
                    width: number,
                    height: number
                  ) => {
                    this.currentSize.width = width;
                    this.currentSize.height = height;
                    this.currentPos.top = top;
                    this.currentPos.left = left;
                  }}
                  initialWidth={cropWidth}
                  initialHeight={cropHeight}
                  initialTop={cropInitialTop}
                  initialLeft={cropInitialLeft}
                  minHeight={100}
                  minWidth={100}
                />
              )}
            </ScrollView>
            {this.props.SearchBottomSheet}
          </View>
        </View>
      );
    }
  }
}

export default ExpoImageManipulator;

ExpoImageManipulator.defaultProps = {
  onPictureChoosed: ({ uri, base64 }) => console.log("URI:", uri, base64),
  btnTexts: {
    crop: "Crop",
    rotate: "Rotate",
    done: "Done",
    processing: "Processing",
  },
  dragVelocity: 100,
  resizeVelocity: 50,
  saveOptions: {
    compress: 1,
    format: ImageManipulator.SaveFormat.PNG,
    base64: false,
  },
};

ExpoImageManipulator.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onPictureChoosed: PropTypes.func,
  btnTexts: PropTypes.object,
  saveOptions: PropTypes.object,
  photo: PropTypes.object.isRequired,
  onToggleModal: PropTypes.func.isRequired,
  dragVelocity: PropTypes.number,
  resizeVelocity: PropTypes.number,
};
