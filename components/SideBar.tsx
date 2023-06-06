import { usePlaylistContext } from "../context/PlaylistContext";

export const SideBar = () => {
  const {
    playlistContextState: { playlists },
  } = usePlaylistContext();
  return (
    <div>
      <div className="border-gray-400 border-b pb-2">
        <div>Home</div>
        <div>Search</div>
        <div>Your library</div>
      </div>
      <div>
        <div className="font-medium mt-3 mb-2">PLAYLISTS</div>
        {playlists.map(({ name, id }) => (
          <div className="hover:text-white cursor-pointer" key={id}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};
