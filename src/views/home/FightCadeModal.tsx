import HomeModal from "./HomeModal";

function FightCadeModal() {
  return (
    <HomeModal linkText="A Note About 3S and HFTF" modalID="fc2-modal">
      <h3 className="font-bold text-lg">A Note About 3S and HFTF</h3>
      <p className="pt-4">
        On FightCade 2,{" "}
        <strong>Street Fighter III Third Strike: Fight for the Future</strong>{" "}
        as well as{" "}
        <strong>JoJo's Bizarre Adventure: Heritage for the Future</strong>{" "}
        generally load two .zip files when booting the game. In both cases, this
        is done to use a specific revision of each game.
      </p>
      <p className="pt-4">You can read up on the specific revisions below:</p>
      <div className="pt-4">
        <details
          className="collapse bg-base-100 border border-base-300"
          name="my-accordion-det-1"
        >
          <summary className="collapse-title font-semibold">
            Third Strike Revision 990152
          </summary>
          <div className="collapse-content text-sm space-y-2">
            <p>Third Strike has three known revisions, being:</p>
            <ul className="list">
              <li className="list-row">990419</li>
              <li className="list-row">990152</li>
              <li className="list-row">990608</li>
            </ul>
            <p>
              Little to no info is known about 990419, but it is generally
              lumped in with 990152 as revision "A". 990608 fixes several
              glitches and is often referred to as revision "B".
            </p>
            <p>
              Despite these fixes, 990152 remains as the competitive standard
              due to 990608's removal of unblockables, severely hurting both Oro
              and Urien. The game was deemed more competitive with these
              unblockables kept in, making 990152 the standard on FightCade 2.
            </p>
          </div>
        </details>
        <details
          className="collapse bg-base-100 border border-base-300"
          name="my-accordion-det-1"
        >
          <summary className="collapse-title font-semibold">
            Heritage for the Future Revision 990913
          </summary>
          <div className="collapse-content text-sm space-y-2">
            <p>Heritage for the Future has three known revisions, being:</p>
            <ul className="list">
              <li className="list-row">990913</li>
              <li className="list-row">990927</li>
              <li className="list-row">991015</li>
            </ul>
            <p>
              The differences between these three revisions are not particularly
              well known. The most notable difference in 990927 besides fixing
              some minor bugs is that Mariah can no longer combo her 214AA into
              itself at higher outlet levels. Despite the minor change however,
              revision 990913 is the default on FightCade, and thus became the
              competitive standard.
            </p>
          </div>
        </details>
      </div>
      <p className="mt-4">
        In any case, when running Third Strike or Heritage, you will be loading
        two .zip files per game. <strong>sfiii3</strong> and{" "}
        <strong>sfiii3nr</strong> in the case of Third Strike, and{" "}
        <strong>jojoba</strong> and <strong>jojobanr1</strong> in the case of
        Heritage for the Future.
      </p>
      <p className="mt-4">
        <strong>sfiii3nr</strong> and <strong>jojobanr1</strong> contain the
        code for these specific revisions. <strong>sfiii3</strong> and{" "}
        <strong>jojoba</strong> contain everything else, such as graphics and
        audio.
      </p>
      <p className="mt-4">
        Please keep this in mind when converting these games, whether combining
        the ROMs for use with modding tools such as X.C.O.P.Y, or splitting the
        ROMs for use with FightCade 2.
      </p>
    </HomeModal>
  );
}

export default FightCadeModal;
