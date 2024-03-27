/**
  @fileoverview Data source for the MongoDB Chatbot Framework docs.
 */
import {
  MakeMdOnGithubDataSourceParams,
  makeMdOnGithubDataSource,
} from "mongodb-rag-ingest/sources";
import { DataSource } from 'mongodb-rag-ingest/sources'; // Adjust imports as needed
import { Page } from 'mongodb-rag-core'; // Adjust imports as needed
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
// jsonFilesDataSource.ts

const directoryPath = '/Users/chess/github code/chatbot/examples/quick-start/markdown_files';
// Custom function to create a DataSource from Markdown files
export const createMarkdownDataSource = (): DataSource => ({
  name: 'MarkdownFilesDataSource',
  async fetchPages() {
    const files = fs.readdirSync(directoryPath);
    return files.filter(file => file.endsWith('.md')).map(file => {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: metadata, content } = matter(fileContent);
      const uniqueUrl = `https://example.com/markdown/${path.basename(file, '.md')}`;

      return {
        format: 'md', // Assuming markdown format
        url: uniqueUrl, // URL if applicable, otherwise leave as an empty string
        title: metadata.Title || '', // Using the Title from metadata or an empty string if not present
        body: content, // The main content of the markdown file
        metadata: {
          // Correctly accessing fields as they appear in your Markdown's metadata
          "SCOPUS_ID": metadata['SCOPUS_ID'] || 'N/A',
          "Title": metadata['Title'] || 'N/A',
          "Author": metadata['Author'] || 'N/A',
          "Journal": metadata['Journal'] || 'N/A',
          "Publication Date": metadata['Publication Date'] || 'N/A',
          "Publication Year": metadata['Publication Year'] || 'N/A',
          "DOI": metadata['DOI'] || 'N/A',
          "Source Type": metadata['Source Type'] || 'N/A',
          "Document Type": metadata['Document Type'] || 'N/A',
          "Document Type Description": metadata['Document Type Description'] || 'N/A',
          "Affliation": metadata['Affliation'] || 'N/A',
          "Affliation Country": metadata['Affliation Country'] || 'N/A',
          "Cited by count": metadata['Cited by count'] || 'N/A',
          "Abstract": metadata['Abstract'] || 'N/A',
        },
        sourceName: 'markdown_files', // Name of this data source
      };
    });
  },
});