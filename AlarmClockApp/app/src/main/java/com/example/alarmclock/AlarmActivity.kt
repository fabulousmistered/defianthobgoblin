// AlarmActivity.kt
import android.media.MediaPlayer
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button

class AlarmActivity : AppCompatActivity() {

    private lateinit var mediaPlayer: MediaPlayer

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_alarm)

        val stopAlarmButton: Button = findViewById(R.id.stopAlarmButton)

        // Start playing the alarm sound
        mediaPlayer = MediaPlayer.create(this, R.raw.alarm_sound)
        mediaPlayer.isLooping = true
        mediaPlayer.start()

        stopAlarmButton.setOnClickListener {
            mediaPlayer.stop()
            mediaPlayer.release()
            finish()
        }
    }
}
