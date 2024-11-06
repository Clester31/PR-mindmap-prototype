import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css'

const apiKey = '46834432-8a53092628e33a278a1baf5c7';

interface Node {
  id: string;
  position: { x: number, y: number };
  nodeType: string;
  borderColor: string;
  image: string;
  video: string;
}

export default function App() {
  const [nodeType, setNodeType] = useState<string>("value");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string>();

  const [mediaDisplay, setMediaDisplay] = useState<boolean>(false);
  const [imageSelectionDisplay, setImageSelectionDisplay] = useState<boolean>(false);

  const [imageGallery, setImageGallery] = useState<string[]>([]);

  const [video, setVideo] = useState<string | null>(null);

  const addNodeToCanvas = (e: React.MouseEvent<HTMLDivElement>, nodeType: string | undefined) => {
    const x = e.clientX - 50;
    const y = e.clientY - 50;

    const newNode = {
      id: uuidv4(),
      position: { x: x, y: y },
      nodeType: nodeType || 'none',
      borderColor: setBorderColor(nodeType),
      image: "",
      video: ""
    }

    setNodes((prev) => [...prev, newNode]);
  }

  const setBorderColor = (nodeType: string | undefined) => {
    if (nodeType === 'value') {
      return 'red'
    } else if (nodeType === 'role') {
      return 'blue'
    } else {
      return 'green';
    }
  }

  const handleAddMedia = (e: React.MouseEvent<HTMLButtonElement>, nodeId: string) => {
    e.stopPropagation();
    setMediaDisplay(true);
    setActiveNodeId(nodeId);
  }

  const handleAddImage = async () => {
    setImageGallery([]);
    const query = prompt("Search for an image:");
    if (query) {
      const images = await searchForImage(query);
      images.map((image: { previewURL: string }) => {
        setImageGallery(prev => [...prev, image.previewURL])
      })
    }
    setImageSelectionDisplay(true);
    setMediaDisplay(false);
  }

  const handleAddVideo = () => {
    const query = prompt("paste a link to a youtube video here:");
    if (query) {
      setVideo(query);
      addVideoToNode(activeNodeId, query);
    }
  }

  const searchForImage = async (query: string | null) => {
    if (!query) return [];
    console.log("searching...")
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.hits;
    } catch (e) {
      console.error("Error fetching image: ", e);
      return [];
    }
  }

  const addImageToNode = (activeNodeId: string | undefined, image: string | undefined) => {
    const updatedNodes = nodes.map((node: Node) => {
      if (node.id === activeNodeId) {
        return { ...node, image: image || "" }
      }
      return node;
    });
    setNodes(updatedNodes);
    setImageSelectionDisplay(false);
  }

  const addVideoToNode = (activeNodeId: string | undefined, video: string | undefined) => {
    const updatedNodes = nodes.map((node: Node) => {
      if (node.id === activeNodeId) {
        return { ...node, video: video || "" }
      }
      return node;
    })
    setNodes(updatedNodes);
  }

  const removeNode = (e: React.MouseEvent<HTMLButtonElement>, nodeId: string) => {
    e.stopPropagation();
    setNodes(nodes.filter(node => node.id !== nodeId))
  }

  return (
    <>
      <div className="p-4 flex flex-row">
        <h1 className="text-3xl font-bold underline">
          Mind Map
        </h1>
        <div className="flex flex-row text-center items-center ml-10">
          <label htmlFor="node-select">Select node type:</label>
          <select
            className="node-select mx-5 border-black border-2"
            onChange={(e) => setNodeType(e.target.value)}
          >
            <option value="value">Value</option>
            <option value="role">Role</option>
            <option value="asset">Asset</option>
          </select>
        </div>
      </div>
      <main className="h-screen w-screen flex justify-center">
        <div
          className="mm-canvas w-11/12 h-screen border-2 border-black rounded-xl items-center justify-center mt-10"
          id="canvas"
          onClick={(e) => addNodeToCanvas(e, nodeType)}
        >
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute flex flex-col items-center justify-center rounded-full text-center p-4 border-2 border-black`}
              style={{ left: node.position.x, top: node.position.y, borderColor: node.borderColor }}
            >
              {/* list node type */}
              <h1 className='font-semibold'>{node.nodeType}</h1>
              {
                // hide the input if the node has an image
                !node.image &&
                <input
                  type="text"
                  className='border-2 border-gray-500 rounded-xl p-1 text-center'
                  onClick={(e) => e.stopPropagation()}
                />
              }

              {
                // if the node is of type 'asset', let users add media (photo, video)
                node.nodeType === 'asset' &&
                // hide the 'add media' button if there is already an image inside teh node
                !node.image &&
                <button
                  className='border-2 border-gray-500 rounded-xl p-1 text-center mt-1'
                  onClick={(e) =>
                    handleAddMedia(e, node.id)
                  }
                >
                  Add Media
                </button>
              }
              {
                // add the image
                node.image &&
                <div className='py-2'>
                  <img
                    src={node.image}
                    className='rounded-xl'
                    alt="node image"
                  />
                </div>
              }
              {
                // add the video
                node.video &&
                <div className='py-2'>
                  <iframe
                    src={node.video}
                    className='rounded-xl'
                    title="node video"
                  />
                </div>
              }
              {/* button to remove the node */}
              <button
                className='bg-red-500 p-2 text-white rounded-xl my-2'
                onClick={(e) => removeNode(e, node.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {mediaDisplay &&
          <div
            className="media-display absolute rounded-xl border-2 border-black w-96"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50
            }}
          >
            {addMediaDisplay({ handleAddImage, handleAddVideo })}
          </div>
        }
        {imageSelectionDisplay &&
          <div className='flex justify-center'>
            <div
              className="media-display absolute rounded-xl border-2 border-black w-1/2 m-auto bg-gray-400 p-2"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 50
              }}
            >
              <div className='grid grid-cols-5'>
                {imageGallery.map((image) => {
                  return (
                    <button
                      className='p-2'
                      onClick={() => addImageToNode(activeNodeId, image)}>
                      <img
                        src={image}
                        className='w-32 h-32 rounded-md border-2 border-black'
                        alt="Gallery Image"
                      />
                    </button>
                  )
                })}
              </div>
              <div className='flex justify-center'>
                <button
                  className='bg-blue-500 text-white rounded-xl p-2'
                  onClick={() => setImageSelectionDisplay(false)}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        }
      </main>
    </>
  )
}

function addMediaDisplay({ handleAddImage, handleAddVideo }: { handleAddImage: () => void; handleAddVideo: () => void }) {
  return (
    <div className='bg-gray-500 text-white p-8 flex flex-col text-center justify-center text-xl'>
      <h1>Add Media</h1>
      <div className='flex flex-row justify-center text-center p-2'>
        <button
          className='bg-blue-500 p-2 mx-2'
          onClick={() => handleAddImage()}
        >
          Add Picture
        </button>
        <button
          className='bg-green-500 p-2 mx-2'
          onClick={() => handleAddVideo()}
        >
          Add Video
        </button>
      </div>
    </div>
  )
}
