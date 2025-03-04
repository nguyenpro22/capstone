"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  Share2,
  MessageSquare,
  Users,
  ShoppingCart,
  Send,
  Gift,
  ThumbsUp,
  Star,
  Clock,
  Plus,
  Minus,
  ChevronRight,
  Flag,
  Home,
  User,
  ShoppingBag,
  PlaySquare,
  MoreVertical,
  Bell,
} from "lucide-react";
import Image from "next/image";
import { GradientButton } from "@/components/ui/gradient-button";

// Define types
interface LivestreamProduct {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  image: string;
  inStock: boolean;
  sold: number;
  isPromoted: boolean;
}

interface LivestreamComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isHost: boolean;
}

export default function LivestreamView() {
  // Mock data for products
  const products: LivestreamProduct[] = [
    {
      id: "1",
      name: "Bộ sản phẩm dưỡng da cao cấp",
      price: 1500000,
      discountPrice: 1200000,
      image:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576255/gynaxhkdy9u3c8id159o.png",
      inStock: true,
      sold: 42,
      isPromoted: true,
    },
    {
      id: "2",
      name: "Serum chống lão hóa",
      price: 850000,
      discountPrice: 680000,
      image:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576257/zb2kg2egoc9v26suet1e.png",
      inStock: true,
      sold: 28,
      isPromoted: false,
    },
    {
      id: "3",
      name: "Mặt nạ dưỡng ẩm",
      price: 350000,
      discountPrice: 280000,
      image: "/placeholder.svg?height=100&width=100",
      inStock: true,
      sold: 65,
      isPromoted: false,
    },
    {
      id: "4",
      name: "Kem chống nắng SPF 50+",
      price: 450000,
      discountPrice: 380000,
      image: "/placeholder.svg?height=100&width=100",
      inStock: false,
      sold: 89,
      isPromoted: false,
    },
    {
      id: "5",
      name: "Tinh chất dưỡng tóc",
      price: 550000,
      discountPrice: 440000,
      image: "/placeholder.svg?height=100&width=100",
      inStock: true,
      sold: 37,
      isPromoted: false,
    },
    {
      id: "6",
      name: "Sữa rửa mặt trị mụn",
      price: 320000,
      discountPrice: 256000,
      image: "/placeholder.svg?height=100&width=100",
      inStock: true,
      sold: 112,
      isPromoted: true,
    },
  ];

  // Mock data for comments
  const comments: LivestreamComment[] = [
    {
      id: "1",
      userId: "host",
      userName: "Dr. Minh Thư",
      userAvatar:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png",
      text: "Xin chào mọi người! Hôm nay chúng ta sẽ nói về cách chăm sóc da mùa hè.",
      timestamp: "00:05",
      isHost: true,
    },
    {
      id: "2",
      userId: "user1",
      userName: "Ngọc Linh",
      userAvatar: "/placeholder.svg?height=40&width=40",
      text: "Chào bác sĩ, làn da của em rất nhạy cảm. Em nên dùng sản phẩm nào ạ?",
      timestamp: "00:45",
      isHost: false,
    },
    {
      id: "3",
      userId: "host",
      userName: "Dr. Minh Thư",
      userAvatar:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png",
      text: "Chào Ngọc Linh, với da nhạy cảm em nên dùng bộ sản phẩm không chứa cồn và hương liệu. Serum chống lão hóa của chúng tôi rất phù hợp.",
      timestamp: "01:10",
      isHost: true,
    },
    {
      id: "4",
      userId: "user2",
      userName: "Thanh Hà",
      userAvatar: "/placeholder.svg?height=40&width=40",
      text: "Bộ sản phẩm dưỡng da cao cấp có phù hợp với da dầu không ạ?",
      timestamp: "01:30",
      isHost: false,
    },
    {
      id: "5",
      userId: "user3",
      userName: "Minh Tuấn",
      userAvatar: "/placeholder.svg?height=40&width=40",
      text: "Em vừa mua serum chống lão hóa, rất hiệu quả! ❤️",
      timestamp: "01:45",
      isHost: false,
    },
    {
      id: "6",
      userId: "host",
      userName: "Dr. Minh Thư",
      userAvatar:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png",
      text: "Thanh Hà, bộ sản phẩm này có phiên bản dành cho da dầu, em có thể chọn loại đó nhé.",
      timestamp: "02:00",
      isHost: true,
    },
    {
      id: "7",
      userId: "user4",
      userName: "Hồng Nhung",
      userAvatar: "/placeholder.svg?height=40&width=40",
      text: "Mặt nạ dưỡng ẩm dùng mấy lần một tuần vậy bác sĩ?",
      timestamp: "02:15",
      isHost: false,
    },
    {
      id: "8",
      userId: "host",
      userName: "Dr. Minh Thư",
      userAvatar:
        "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png",
      text: "Hồng Nhung, mặt nạ dưỡng ẩm nên dùng 2-3 lần/tuần tùy theo tình trạng da của bạn nhé.",
      timestamp: "02:30",
      isHost: true,
    },
  ];

  const [commentInput, setCommentInput] = useState("");
  const [likeCount, setLikeCount] = useState(1245);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<LivestreamProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [viewerCount, setViewerCount] = useState(328);
  const [showHearts, setShowHearts] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const handleSendComment = () => {
    if (commentInput.trim() === "") return;
    // In a real app, you would send the comment to the server here
    setCommentInput("");
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
      // Show heart animation
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 1500);
    }
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (product: LivestreamProduct) => {
    // In a real app, you would add the product to the cart here
    console.log("Added to cart:", product, "Quantity:", quantity);
  };

  const handleBuyNow = (product: LivestreamProduct) => {
    // In a real app, you would proceed to checkout here
    console.log("Buy now:", product, "Quantity:", quantity);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
        <div className="container px-4 mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold">Livestream</h1>
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 mx-auto py-6">
        <div
          className={`grid ${
            isChatExpanded ? "grid-cols-1" : "lg:grid-cols-3"
          } gap-6`}
        >
          {/* Video Player */}
          <div
            className={`${
              isChatExpanded ? "hidden lg:block" : "lg:col-span-2"
            } space-y-4`}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=600&width=1000"
                  alt="Livestream"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Livestream UI Elements */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="border-2 border-primary h-12 w-12">
                      <AvatarImage
                        src="https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png"
                        alt="Dr. Minh Thư"
                      />
                      <AvatarFallback>MT</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white">Dr. Minh Thư</h3>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          Bác sĩ da liễu
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white/10 text-white text-xs"
                        >
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          4.9
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-black/50 text-white border-white/20 flex items-center gap-1"
                    >
                      <Users className="h-3.5 w-3.5" />
                      {viewerCount.toLocaleString()}
                    </Badge>
                    <Button
                      variant={isFollowing ? "default" : "outline"}
                      size="sm"
                      className={
                        isFollowing
                          ? "bg-primary"
                          : "bg-black/50 text-white border-white/20"
                      }
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                    </Button>
                  </div>
                </div>

                {/* Heart Animation */}
                {showHearts && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                          left: `${Math.random() * 100}%`,
                          bottom: "10%",
                          animationDelay: `${Math.random() * 0.5}s`,
                          animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                      >
                        <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      className={
                        isLiked
                          ? "bg-pink-500 hover:bg-pink-600 text-white border-pink-500"
                          : "bg-black/50 text-white border-white/20"
                      }
                      onClick={handleLike}
                    >
                      <Heart
                        className={`h-4 w-4 mr-1 ${
                          isLiked ? "fill-current" : ""
                        }`}
                      />
                      {likeCount.toLocaleString()}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black/50 text-white border-white/20"
                      onClick={() => setIsChatExpanded(!isChatExpanded)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {comments.length}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black/50 text-white border-white/20"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Chia sẻ
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/50 text-white border-white/20"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Báo cáo
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Promoted Product */}
            {products.filter((p) => p.isPromoted).length > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 p-4 rounded-lg border border-pink-100 dark:border-pink-900">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Badge variant="destructive">Đang giới thiệu</Badge>
                    Sản phẩm đặc biệt
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-white/80 dark:bg-black/30"
                  >
                    Giảm 20% chỉ trong livestream
                  </Badge>
                </div>

                {products
                  .filter((p) => p.isPromoted)
                  .map((product) => (
                    <div key={product.id} className="flex gap-4 items-center">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-semibold text-primary">
                            {product.discountPrice.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-muted-foreground line-through">
                            {product.price.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Thêm vào giỏ
                          </Button>
                          <GradientButton
                            className="flex-1"
                            onClick={() => setSelectedProduct(product)}
                          >
                            Mua ngay
                          </GradientButton>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Products Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-semibold">
                  Sản phẩm trong livestream
                </h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  Xem tất cả
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex space-x-4">
                  {products.map((product) => (
                    <div key={product.id} className="w-[200px] flex-shrink-0">
                      <Card className="overflow-hidden border-primary/10">
                        <CardContent className="p-0">
                          <div className="relative aspect-square">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white font-medium">
                                  Hết hàng
                                </span>
                              </div>
                            )}
                            {product.isPromoted && (
                              <Badge className="absolute top-2 left-2 bg-primary">
                                Đang giới thiệu
                              </Badge>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium text-sm line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="text-primary font-semibold">
                                {product.discountPrice.toLocaleString("vi-VN")}đ
                              </span>
                              <span className="text-muted-foreground text-xs line-through">
                                {product.price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Đã bán: {product.sold}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                          <Button
                            className="w-full text-xs"
                            size="sm"
                            disabled={!product.inStock}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                            Mua ngay
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Chat Section */}
          <div
            className={`${
              isChatExpanded ? "block" : "hidden lg:block"
            } lg:col-span-1 border rounded-lg bg-white dark:bg-gray-900 overflow-hidden flex flex-col h-[80vh]`}
          >
            <div className="p-3 border-b flex items-center justify-between">
              <Tabs defaultValue="chat" className="flex-1 h-full">
                <div className="flex items-center justify-between w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="chat" className="flex-1">
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="products" className="flex-1">
                      Sản phẩm
                    </TabsTrigger>
                    <TabsTrigger value="info" className="flex-1">
                      Thông tin
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden ml-2"
                    onClick={() => setIsChatExpanded(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-x"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
                <TabsContent
                  value="chat"
                  className="flex-1 flex flex-col p-0 m-0 h-full"
                >
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start gap-2"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={comment.userAvatar}
                              alt={comment.userName}
                            />
                            <AvatarFallback>
                              {comment.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-medium text-sm ${
                                  comment.isHost ? "text-primary" : ""
                                }`}
                              >
                                {comment.userName}
                              </span>
                              {comment.isHost && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-4 bg-primary/10 text-primary"
                                >
                                  Host
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-3 border-t mt-auto">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Nhập bình luận..."
                        className="flex-1"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendComment();
                          }
                        }}
                      />
                      <Button
                        variant="default"
                        size="icon"
                        className="rounded-full"
                        onClick={handleSendComment}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="p-0 m-0">
                  <ScrollArea className="h-[calc(80vh-53px)] p-3">
                    <div className="space-y-4">
                      {products.map((product) => (
                        <Card
                          key={product.id}
                          className="overflow-hidden border-primary/10"
                        >
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                                {product.isPromoted && (
                                  <Badge className="absolute top-1 left-1 text-[10px] bg-primary">
                                    Hot
                                  </Badge>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-sm">
                                  {product.name}
                                </h3>
                                <div className="mt-1 flex items-baseline gap-2">
                                  <span className="text-primary font-semibold">
                                    {product.discountPrice.toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </span>
                                  <span className="text-muted-foreground text-xs line-through">
                                    {product.price.toLocaleString("vi-VN")}đ
                                  </span>
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Đã bán: {product.sold}
                                </div>
                                <Button
                                  className="w-full mt-2 text-xs"
                                  size="sm"
                                  disabled={!product.inStock}
                                  onClick={() => setSelectedProduct(product)}
                                >
                                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                                  Mua ngay
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="info" className="p-0 m-0">
                  <ScrollArea className="h-[calc(80vh-53px)] p-4">
                    <div className="space-y-4">
                      <div className="text-center">
                        <Avatar className="h-20 w-20 mx-auto">
                          <AvatarImage
                            src="https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png"
                            alt="Dr. Minh Thư"
                          />
                          <AvatarFallback>MT</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold mt-2">Dr. Minh Thư</h3>
                        <p className="text-sm text-muted-foreground">
                          Bác sĩ da liễu - Beauty Clinic Saigon
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>4.9</span>
                          <span className="text-muted-foreground">
                            (128 đánh giá)
                          </span>
                        </div>
                        <Button
                          variant={isFollowing ? "default" : "outline"}
                          size="sm"
                          className="mt-3"
                          onClick={handleFollow}
                        >
                          {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Giới thiệu</h4>
                        <p className="text-sm text-muted-foreground">
                          Dr. Minh Thư là bác sĩ da liễu với hơn 10 năm kinh
                          nghiệm trong lĩnh vực thẩm mỹ và chăm sóc da. Tốt
                          nghiệp Đại học Y Dược TP.HCM và tu nghiệp tại Hàn
                          Quốc, Dr. Minh Thư hiện là Giám đốc chuyên môn tại
                          Beauty Clinic Saigon.
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">
                          Thông tin livestream
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Thời gian: 20:00 - 21:30, 26/02/2025</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Ưu đãi: Giảm 20% tất cả sản phẩm trong livestream
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            <span>Miễn phí tư vấn da trực tiếp</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Product Quick Buy Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-primary font-semibold">
                      {selectedProduct.discountPrice.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-muted-foreground text-xs line-through">
                      {selectedProduct.price.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Đã bán: {selectedProduct.sold}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Số lượng:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Tổng tiền:</span>
                  <span className="text-lg font-semibold text-primary">
                    {(selectedProduct.discountPrice * quantity).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
                <GradientButton
                  onClick={() => {
                    handleBuyNow(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Mua ngay
                </GradientButton>
              </div>
            </CardContent>
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => setSelectedProduct(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t py-2 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Trang chủ</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Chat</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2 text-primary"
            >
              <PlaySquare className="h-5 w-5" />
              <span className="text-xs">Livestream</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs">Đơn hàng</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Cá nhân</span>
            </Button>
          </div>
        </div>
      </div>

      {/* CSS for heart animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
