//src/pages/Category.tsx
import { useState } from 'react';
import BlogHeader from '../components/category/BlogHeader';
import CategoryBar from '../components/category/CategoryBar';
import BlogGrid from '../components/category/BlogGrid';

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <BlogHeader onSearch={setSearchQuery} />
      <CategoryBar 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />
      <BlogGrid 
        selectedCategory={selectedCategory} 
        searchQuery={searchQuery} 
      />
    </>
  );
}