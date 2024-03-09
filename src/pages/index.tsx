import Image from "next/image";
import { Inter } from "next/font/google";
import { Button, Form, Input } from "antd";
import {
  ChangeEventHandler,
  ReactElement,
  ReactHTMLElement,
  useState,
} from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [image, setImage] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const handleMultipleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      console.log(files);
      setImage(files);

      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const miltipleImageUpload = async () => {
    let formData = new FormData();

    Array.from(image).forEach((item) => {
      formData.append("images", item);
    });

    const url = "http://localhost:8000/images";

    axios
      .post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((result) => {
        console.log("Result", result);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  return (
    <main className={`${inter.className}`}>
      <div className="flex flex-wrap">
        {imagePreviews?.map((preview, index) =>
          preview ? (
            <Image
              key={index}
              src={preview}
              alt={`Preview ${index}`}
              style={{ width: "100px", height: "auto" }}
              width={100}
              height={200}
            />
          ) : null
        )}
      </div>
      {/* <Form> */}
      <Input type="file" multiple onChange={handleMultipleImage} />
      <Button name="Check" onClick={miltipleImageUpload}>
        Check
      </Button>
      {/* </Form> */}
    </main>
  );
}
