"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsQuery } from "@/features/products/queries";
import { createProductAction, deleteProductAction, updateProductAction, uploadImageAction } from "@/features/products/actions";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductInput } from "@/features/products/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2Icon, ArrowUpDown, UploadCloud, Image as ImageIcon } from "lucide-react";
import { SpinnerCustom } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";

type Product = NonNullable<Awaited<ReturnType<typeof getProductsQuery>>>[0];

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await getProductsQuery(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteProductAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductInput) => await createProductAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsAddOpen(false);
      form.reset();
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductInput }) => await updateProductAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      form.reset();
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const onSubmit = async (data: ProductInput) => {
    let finalImageUrl = data.imageUrl;

    if (imageFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadResult = await uploadImageAction(formData);
      setIsUploading(false);

      if (uploadResult.error) {
        toast.error(uploadResult.error);
        return;
      }
      if (uploadResult.url) {
        finalImageUrl = uploadResult.url;
      }
    }

    const payload = { ...data, imageUrl: finalImageUrl };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const openAddDialog = () => {
    form.reset({ name: "", description: "", price: 0, imageUrl: "" });
    setEditingProduct(null);
    setImageFile(null);
    setIsAddOpen(true);
  };

  const openEditDialog = (product: Product) => {
    form.reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
    });
    setEditingProduct(product);
    setImageFile(null);
  };

  const closeDialog = () => {
    setIsAddOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    form.reset();
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => {
        const url = row.getValue("imageUrl") as string;
        if (!url) return <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground border">No img</div>;
        return <img src={url} alt="Product" className="w-10 h-10 object-cover rounded-md border shadow-sm" />;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div 
            className="max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] truncate" 
            title={description}
          >
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount / 100);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{product.name}". This action cannot be undone and will remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={() => deleteMutation.mutate(product.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>

        <Dialog open={isAddOpen || !!editingProduct} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Product description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (in cents)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Product Image
                  </label>
                  
                  <div className="flex flex-col items-center justify-center w-full">
                    <label 
                      htmlFor="dropzone-file" 
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:hover:bg-bray-800 dark:bg-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:border-zinc-700 transition-all overflow-hidden relative"
                    >
                      {imageFile || (editingProduct?.imageUrl && !imageFile) ? (
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                          <img 
                            src={imageFile ? URL.createObjectURL(imageFile) : editingProduct?.imageUrl || ""} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain rounded-md" 
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-500 dark:text-zinc-400">
                          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <p className="mb-1 text-sm font-semibold">Click to upload</p>
                          <p className="text-xs">SVG, PNG, JPG or WEBP (MAX. 4MB)</p>
                        </div>
                      )}
                      
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                      />
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
                  {createMutation.isPending || updateMutation.isPending || isUploading ? "Saving..." : "Save Product"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <SpinnerCustom />
      ) : (
        <DataTable columns={columns} data={products} searchKey="name" />
      )}
    </div>
  );
}
