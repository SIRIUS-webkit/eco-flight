import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "dgllpowes",
  api_key: "896352858768749",
  api_secret: "gwGy6s3dqbrJQ8iwwxbESLSmB0I",
});

export async function POST(request) {
  try {
    const formData = await request.formData(); // Parse the form-data request
    const file = formData.get("file"); // Get the 'file' field from form-data

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileBuffer = await file.arrayBuffer(); // Convert file to ArrayBuffer
    const base64File = Buffer.from(fileBuffer).toString("base64");

    const uploadResponse = await cloudinary.v2.uploader.upload(
      `data:${file.type};base64,${base64File}`, // Upload as base64 data URL
      { folder: "project_images" }
    );

    return new Response(
      JSON.stringify({
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Image upload failed",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json(); // Parse JSON request body
    const { publicId } = body; // Expect public ID from client for deletion

    await cloudinary.v2.uploader.destroy(publicId);

    return new Response(
      JSON.stringify({ message: "Image deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Image deletion failed",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
