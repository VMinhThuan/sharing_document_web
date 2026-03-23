export const formatFileType = (type) => {
  if (!type) return "FILE";
  const t = type.toLowerCase();
  if (t.includes("pdf")) return "PDF";
  if (t.includes("wordprocessingml") || t.includes("msword") || t.includes("docx")) return "DOCX";
  if (t.includes("presentationml") || t.includes("powerpoint") || t.includes("pptx")) return "PPTX";
  if (t.includes("spreadsheetml") || t.includes("excel") || t.includes("xlsx")) return "XLSX";
  if (t.includes("image")) return "IMG";
  if (t.includes("text/plain")) return "TXT";
  if (t.includes("zip") || t.includes("rar")) return "ARCHIVE";
  
  // Truncate long MIME types if not matched
  const parts = t.split("/");
  const lastPart = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  
  // Clean up common prefixes
  let cleaned = lastPart
    .replace("vnd.openxmlformats-officedocument.", "")
    .replace("vnd.", "");
    
  if (cleaned.length > 7) {
    return (cleaned.substring(0, 5) + "...").toUpperCase();
  }
  
  return cleaned.toUpperCase();
};
